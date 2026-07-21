with open("src/components/admin/OnyxTerminal.jsx", "r") as f:
    content = f.read()

content = content.replace(
    "setResponseLog(`[ERROR] ${data.error || 'Transmission rejected by Edge Node'} // EDGE_RTT:${latencyMilli}ms`);",
    "setResponseLog(`[ERROR] ${data.error || 'Transmission rejected by Edge Node'} // EDGE_RTT:${latencyMilli}ms`);\n        logTelemetry('onyx_kv_write_failed', { key: kvKey, error: data.error });"
)

with open("src/components/admin/OnyxTerminal.jsx", "w") as f:
    f.write(content)
