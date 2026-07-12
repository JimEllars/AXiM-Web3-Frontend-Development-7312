import { useState, useCallback } from 'react';
import { replayRecords } from '../services/echoService.js';
import { useAximStore } from '../store/useAximStore.js';

export const useEchoData = () => {
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayError, setReplayError] = useState(null);

  // Note: We use the existing Zustand store for global states, like toasts.
  const addToast = useAximStore((state) => state.addToast);

  const handleReplay = useCallback(async (recordIds) => {
    if (!recordIds || recordIds.length === 0) return;

    setIsReplaying(true);
    setReplayError(null);

    try {
      // Trigger the replay via the Cloudflare edge worker
      const result = await replayRecords(recordIds);

      if (addToast) {
        addToast(`Successfully queued ${result?.results?.successful?.length || recordIds.length} records for replay`, 'success');
      }

      // We do not manually update Supabase status here;
      // Supabase real-time channels will automatically reflect the state changes ('resolved')
      // broadcasted by the edge worker as it processes the queue.

    } catch (err) {
      console.error('[Echo Data] Replay failed:', err);
      setReplayError(err.message);

      if (addToast) {
        addToast(`Replay failed: ${err.message}`, 'error');
      }
    } finally {
      setIsReplaying(false);
    }
  }, [addToast]);

  return {
    handleReplay,
    isReplaying,
    replayError
  };
};
