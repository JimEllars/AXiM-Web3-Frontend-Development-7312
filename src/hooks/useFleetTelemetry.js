import { useEffect } from 'react';
import { useAximStore } from '../store/useAximStore';

export function useFleetTelemetry() {
  const nodeStatuses = useAximStore((state) => state.nodeStatuses);
  const startTelemetryPolling = useAximStore((state) => state.startTelemetryPolling);

  useEffect(() => {
    startTelemetryPolling();
  }, [startTelemetryPolling]);

  return { nodeStatuses };
}
