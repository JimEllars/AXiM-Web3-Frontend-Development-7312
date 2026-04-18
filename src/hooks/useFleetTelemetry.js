import { useState, useEffect } from 'react';

export function useFleetTelemetry() {
  const [nodeStatuses, setNodeStatuses] = useState({
    nda: 'operational',
    demand: 'operational',
    stub: 'operational',
    core: 'operational'
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchTelemetry() {
      try {
        const response = await fetch('https://api.axim.us.com/v1/functions/device-status');
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data && typeof data === 'object') {
            setNodeStatuses(data);
          }
        }
      } catch (error) {
        console.error("Fleet Telemetry Error:", error);
      }
    }

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000); // 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { nodeStatuses };
}
