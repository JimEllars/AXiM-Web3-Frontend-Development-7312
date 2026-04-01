import { build } from 'vite';

(async () => {
  try {
    console.log('Initiating optimized Vite build (Throttled Concurrency)...');
    
    // We use the programmatic API to inject Rollup options without modifying vite.config.js
    // This merges with the existing vite.config.js automatically.
    await build({
      build: {
        sourcemap: false,
        rollupOptions: {
          // Strictly limit concurrent file operations to prevent EMFILE crashes 
          // in environments with low file descriptor limits (like WebContainers).
          maxParallelFileOps: 2
        }
      }
    });

    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Build failed to complete:', error);
    process.exit(1);
  }
})();