import { useState, useRef, useCallback, useEffect } from 'react';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry, trackEvent } from '../lib/telemetry';

export function useOnyxStream() {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem('AXIM_ONYX_STREAM_MESSAGES');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('AXIM_ONYX_STREAM_MESSAGES', JSON.stringify(messages.slice(-200)));
    } catch (e) { /* ignore */ }
  }, [messages]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [isEdgeCached, setIsEdgeCached] = useState(false);
  const abortControllerRef = useRef(null);

  const token = useAximStore((state) => state.token);
  const addToast = useAximStore((state) => state.addToast);

  const sendMessage = useCallback(async (text, context = {}) => {
    if (!text.trim()) return;

    // Disconnect existing stream if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage].slice(-200));
    setIsStreaming(true);
    setError(null);

    const onyxMessageId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: onyxMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    }].slice(-200));

    trackEvent('onyx_stream_initiated', { promptLength: text.length });
    const startTime = Date.now();

    let retryCount = 0;
    const maxRetries = 4;
    let currentBackoff = 1000;

    const connectStream = async () => {
      try {
        const endpoint = import.meta.env.VITE_ONYX_WORKER_URL || '/api/v1/onyx/stream';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            'X-AXiM-Internal-Key': import.meta.env.VITE_AXIM_INTERNAL_KEY || ''
          },
          body: JSON.stringify({ message: text, context }),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
           throw new Error(`Edge connection failed: ${response.status}`);
        }

        // Inspect headers/response for synthetic flag to determine if response is edge-cached
        if (response.headers.get('x-axim-synthetic') === 'true') {
           setIsEdgeCached(true);
        } else {
           setIsEdgeCached(false);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.error) throw new Error(parsed.error);
                if (parsed.type === 'keepalive') continue;

                if (parsed.content) {
                  setMessages(prev => prev.map(msg =>
                    msg.id === onyxMessageId
                      ? { ...msg, content: msg.content + parsed.content }
                      : msg
                  ));
                }
              } catch (e) {
                console.warn('[SSE Parse Error]', e);
              }
            }
          }
        }

        setIsStreaming(false);
        setMessages(prev => prev.map(msg =>
          msg.id === onyxMessageId
            ? { ...msg, isStreaming: false }
            : msg
        ));
        const endTime = Date.now();
        trackEvent('onyx_stream_completed', {
          responseLength: messages.find(m => m.id === onyxMessageId)?.content?.length || 0,
          latencyMs: endTime - startTime
        });

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Stream aborted by user.');
          trackEvent('onyx_stream_interrupted', { reason: 'user_aborted' });
          return;
        }

        logTelemetry('onyx_stream_interrupted', { reason: err.message });

        if (retryCount < maxRetries) {
          retryCount++;
          const backoff = currentBackoff;
          const jitter = currentBackoff * 0.2 * (Math.random() * 2 - 1);
          currentBackoff = Math.min(currentBackoff * 2 + jitter, 8000);
          console.warn(`[Onyx Stream] Connection lost. Retrying in ${backoff}ms...`);
          trackEvent('onyx_stream_retry', { retryCount, backoff });

          setMessages(prev => prev.map(msg =>
            msg.id === onyxMessageId && !msg.content.includes('[SYSTEM] Reconnecting Uplink...')
              ? { ...msg, content: msg.content + '\n[SYSTEM] Reconnecting Uplink...' }
              : msg
          ));

          setTimeout(connectStream, backoff);
        } else {
          console.error('[Onyx Stream] Max retries reached.', err);
          setError(err.message);
          setIsStreaming(false);

          // Fallback Mode
          setMessages(prev => prev.map(msg =>
            msg.id === onyxMessageId
              ? { ...msg, content: msg.content || `[SYSTEM OFFLINE] Edge uplink failed after ${maxRetries} attempts. Diagnostics: ${err.message}`, isStreaming: false, isFallback: true }
              : msg
          ));
          trackEvent('onyx_stream_failed', { error: err.message });
          if(addToast) addToast(`Onyx connection failed: ${err.message}`, 'error');
        }
      }
    };

    connectStream();
  }, [token, addToast, messages]);

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);

      setMessages(prev => prev.map(msg =>
        msg.isStreaming
          ? { ...msg, content: msg.content + ' [STREAM ABORTED]', isStreaming: false }
          : msg
      ));
    }
  }, []);


  useEffect(() => {
    let intervalId;
    if (isStreaming) {
      intervalId = setInterval(() => {
        // Send a simulated heartbeat to keep stream alive in UI and potentially trigger server keepalive
        setMessages(prev => {
           // We don't want to actually print the heartbeat to the screen, but we can update state to trigger re-renders or logs
           trackEvent('onyx_stream_heartbeat', { status: 'alive' });
           return prev;
        });
      }, 15000);
    }

    return () => {
      clearInterval(intervalId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isStreaming]);

  return { messages, isStreaming, error, isEdgeCached, sendMessage, abortStream };

}
