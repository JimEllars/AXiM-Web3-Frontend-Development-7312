const fs = require('fs');

let content = fs.readFileSync('src/hooks/useAximAuth.test.js', 'utf8');

const testCode = `
  test('should retain session on intermittent 500 errors', async () => {
    // Setup offline session
    const fakeSession = { user: { email: 'test@axim.us.com' } };
    localStore.saveOfflineSession(fakeSession);

    const { supabase } = await import('../lib/supabase.js');
    // Force getSession to throw simulating 500 error
    supabase.auth.getSession.mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useAximAuth());

    await waitFor(() => {
      // It should pull from offline session despite error
      assert.strictEqual(result.current.loading, false);
      assert.deepStrictEqual(result.current.session, fakeSession);
      assert.strictEqual(result.current.profile.email, 'test@axim.us.com');
    }, { timeout: 1000 });
  });
`;

if (!content.includes('should retain session on intermittent 500 errors')) {
    content = content.replace("});\n});", "});\n" + testCode + "\n});");
    fs.writeFileSync('src/hooks/useAximAuth.test.js', content);
}
