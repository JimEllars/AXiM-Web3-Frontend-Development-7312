import { useState, useCallback, useRef } from 'react';
import { useAximStore } from '../store/useAximStore';
import { useAximAuth } from './useAximAuth';

export function useOnyxStream() {
  const [streamResponse, setStreamResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connected' | 'reconnecting' | 'disconnected'

  const userSession = useAximStore((state) => state.userSession);
  const { session } = useAximAuth();

  const token = userSession?.session_token || session?.access_token;
  const abortControllerRef = useRef(null);

  const executeOnyxCommand = useCallback(async (command) => {
    setIsStreaming(true);
    if (connectionStatus !== 'reconnecting') {
      setStreamResponse('');
    }
    setError(null);
    setConnectionStatus('connected');

    let retryCount = 0;
    const maxRetries = 5; // 1s, 2s, 4s, 8s, 16s

    const attemptFetch = async () => {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const response = await fetch('https://wp.axim.us.com/wp-json/axim/v1/onyx-bridge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ command }),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`);
        }

        setConnectionStatus('connected');

        const contentType = response.headers.get('content-type');
        let fullResponse = streamResponse; // Preserve if reconnecting

        if (contentType && contentType.includes('text/event-stream')) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.token) {
                    fullResponse += data.token;
                    setStreamResponse(fullResponse);
                  }
                } catch (e) {
                  // Ignore partial JSON chunks
                }
              }
            }
          }
        } else {
          const data = await response.json();
          fullResponse = data.reply || 'Command executed.';
          setStreamResponse(fullResponse);
        }

        setIsStreaming(false);
        setConnectionStatus('disconnected');
        return fullResponse;

      } catch (err) {
        if (err.name === 'AbortError') return null;

        if (retryCount < maxRetries) {
          setConnectionStatus('reconnecting');
          const delay = Math.pow(2, retryCount) * 1000;
          retryCount++;
          await new Promise(r => setTimeout(r, delay));
          return attemptFetch();
        }

        setConnectionStatus('disconnected');
        setError(err.message);
        setIsStreaming(false);
        return null;
      }
    };

    return attemptFetch();
  }, [token, streamResponse, connectionStatus]);

  return { streamResponse, isStreaming, executeOnyxCommand, error, connectionStatus };
}
