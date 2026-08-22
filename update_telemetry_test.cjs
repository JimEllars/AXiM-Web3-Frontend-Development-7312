const fs = require('fs');

let content = fs.readFileSync('src/lib/telemetry.test.js', 'utf8');

const testCode = `
  it('should buffer events when fetch rejects and batch flush on reconnect', async () => {
    // Override fetch to fail
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    // Override supabase insert to also fail so it stays in queue
    const { supabase } = await import('../lib/supabase.js');
    supabase.from.mockReturnValueOnce({
      insert: vi.fn().mockRejectedValue(new Error('Supabase error'))
    });

    logTelemetry('buffer_test', { data: 1 });
    await flushTelemetryQueue();

    // The fetch failed, the supabase insert failed, the event should be put back in queue
    let store = getTelemetryStore();
    // getTelemetryStore returns the collection which still has the event since it didn't sync
    expect(store.length).toBeGreaterThan(0);

    // Now simulate success
    global.fetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });
    await flushTelemetryQueue();

    store = getTelemetryStore();
    expect(store.length).toBe(0);
  });
`;

if (!content.includes('should buffer events when fetch rejects')) {
    content = content.replace("});\n});", "});\n" + testCode + "\n});");
    fs.writeFileSync('src/lib/telemetry.test.js', content);
}
