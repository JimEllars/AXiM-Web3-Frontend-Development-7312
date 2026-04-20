import { vi } from 'vitest';
vi.stubEnv('VITE_ENABLE_WEB3', 'true');
// Ensure it's populated globally
process.env.VITE_ENABLE_WEB3 = 'true';
global.import = { meta: { env: { VITE_ENABLE_WEB3: 'true' } } };
