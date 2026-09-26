# Telemetry Status

- **Edge Worker Uplink**: Uses a validated `POST` ingest route and a `/api/telemetry/health` response with `status`, `timestamp`, and `version`.
- **Offline Batching**: Events are stored at `localStorage["axim_telemetry_offline_queue"]`. The queue is capped at 100 events, evicting the oldest non-auth/non-error event first.
- **Replay Delivery**: Online and unload triggers use `sendBeacon` first where applicable, then `fetch` with `keepalive`. Failed network and 5xx batches retry up to three times with exponential backoff and jitter.
- **Edge Errors**: Malformed telemetry returns a structured `400`, rate limiting returns `429`, and an unavailable uplink or KV buffer returns `503`. CORS accepts only configured AXiM, Pages preview, and local development origins.
