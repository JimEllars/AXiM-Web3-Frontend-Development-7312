/**
 * Service to interact with the Echo Egress Worker
 */

import { localStore } from '../lib/persistence.js';

export const replayRecords = async (recordIds) => {
  const workerUrl = import.meta.env.VITE_ECHO_WORKER_URL || 'https://echo-worker.axim.workers.dev';
  const internalKey = import.meta.env.VITE_AXIM_INTERNAL_KEY;

  if (!internalKey) {
    console.warn('VITE_AXIM_INTERNAL_KEY is not set. Replay may fail.');
  }

  let retryCount = 0;
  while (retryCount <= 2) {
    try {
      const response = await fetch(`${workerUrl}/api/v1/replay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${internalKey}`
        },
        body: JSON.stringify({ recordIds }),
        signal: AbortSignal.timeout(3000)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to replay records: ${response.status} ${response.statusText} - ${errText}`);
      }

      const data = await response.json();
      localStore.saveArticleCache(data); // Using existing cache function as a generic store for echo fallbacks if needed, or we can use localStorage directly
      try {
        localStorage.setItem('axim_echo_replay_fallback', JSON.stringify(data));
      } catch (e) { /* ignore */ }
      return data;
    } catch (error) {
      if (retryCount < 2) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      } else {
        try {
          const fallback = localStorage.getItem('axim_echo_replay_fallback');
          if (fallback) {
             console.warn('Network or 5xx error during Echo replay. Returning stale-while-revalidate fallback payload.');
             return JSON.parse(fallback);
          }
        } catch (e) { /* ignore */ }
        throw error;
      }
    }
  }
};
