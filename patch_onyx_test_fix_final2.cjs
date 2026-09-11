const fs = require('fs');
let code = fs.readFileSync('src/hooks/useOnyxStream.test.js', 'utf8');

const target = `  it.skip('handles fallback mode on connection failure', async () => {
    const { result } = renderHook(() => useOnyxStream());

    global.fetch.mockImplementation(() => Promise.reject(new Error('Network Error')));

    act(() => {
      result.current.sendMessage('Trigger fallback');
    });

    // Fast-forward through retries
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe('Network Error');

    const messages = result.current.messages;
    const assistantMessage = messages.find(m => m.role === 'assistant');
    expect(assistantMessage.isFallback).toBe(true);
    expect(assistantMessage.content).toContain('[SYSTEM OFFLINE]');
  });`;

code = code.replace(target, '');

const target2 = `    // expect(assistantMessage.content).toMatch(/\\[SYSTEM OFFLINE\\]/);`;
const target3 = `    expect(assistantMessage.content).toMatch(/\\[SYSTEM OFFLINE\\]/);`;

code = code.replace(target2, target3);

fs.writeFileSync('src/hooks/useOnyxStream.test.js', code);
