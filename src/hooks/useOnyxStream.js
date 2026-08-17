import { useState, useRef, useCallback } from 'react';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';

export function useOnyxStream() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
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
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setError(null);

    const onyxMessageId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: onyxMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    }]);

    logTelemetry('onyx_stream_initiated', { promptLength: text.length });

    let retryCount = 0;
    const maxRetries = 3;

    const connectStream = async () => {
      try {
        const endpoint = import.meta.env.VITE_ONYX_WORKER_URL || '/api/onyx/chat';

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
        logTelemetry('onyx_stream_completed', { responseLength: messages.find(m => m.id === onyxMessageId)?.content?.length || 0 });

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Stream aborted by user.');
          return;
        }

        if (retryCount < maxRetries) {
          retryCount++;
          const backoff = Math.pow(2, retryCount) * 1000;
          console.warn(`[Onyx Stream] Connection lost. Retrying in ${backoff}ms...`);
          logTelemetry('onyx_stream_retry', { retryCount, backoff });
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
          logTelemetry('onyx_stream_failed', { error: err.message });
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

  return { messages, isStreaming, error, sendMessage, abortStream };
}
