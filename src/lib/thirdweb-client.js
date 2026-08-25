import { createThirdwebClient } from "thirdweb";
import { logTelemetry } from "./telemetry.js";

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "default_client_id",
});

export const FALLBACK_RPCS = [
  "https://arb1.arbitrum.io/rpc",
  "https://rpc.ankr.com/arbitrum"
];

export async function verifyWeb3Connection() {
  try {
    const rpc = FALLBACK_RPCS[0];
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
        throw new Error(`RPC status ${res.status}`);
    }

    await res.json();
    return true;
  } catch (err) {
    logTelemetry('web3_rpc_fallback_triggered', { fallback: true, error: err.message });
    return false; // Indicating fallback logic or unhealthy state
  }
}
