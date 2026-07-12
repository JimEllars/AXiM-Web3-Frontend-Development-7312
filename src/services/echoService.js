/**
 * Service to interact with the Echo Egress Worker
 */

export const replayRecords = async (recordIds) => {
  const workerUrl = import.meta.env.VITE_ECHO_WORKER_URL || 'https://echo-worker.axim.workers.dev';
  const internalKey = import.meta.env.VITE_AXIM_INTERNAL_KEY;

  if (!internalKey) {
    console.warn('VITE_AXIM_INTERNAL_KEY is not set. Replay may fail.');
  }

  const response = await fetch(`${workerUrl}/api/v1/replay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${internalKey}`
    },
    body: JSON.stringify({ recordIds })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to replay records: ${response.status} ${response.statusText} - ${errText}`);
  }

  return response.json();
};
