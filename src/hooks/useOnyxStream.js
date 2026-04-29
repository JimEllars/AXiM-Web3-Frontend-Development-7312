import { useState } from 'react';
import { useAximStore } from '../store/useAximStore';
import { useAximAuth } from './useAximAuth';

export function useOnyxStream() {
  const [streamResponse, setStreamResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const userSession = useAximStore((state) => state.userSession);
  const { session } = useAximAuth();

  const token = userSession?.session_token || session?.access_token;

  const executeOnyxCommand = async (command) => {
    setIsStreaming(true);
    setStreamResponse('');
    setError(null);

    try {
      const response = await fetch('https://api.axim.us.com/api/onyx-bridge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      let fullResponse = '';

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
      return fullResponse;

    } catch (err) {
      setError(err.message);
      setIsStreaming(false);
      return null;
    }
  };

  return { streamResponse, isStreaming, executeOnyxCommand, error };
}
