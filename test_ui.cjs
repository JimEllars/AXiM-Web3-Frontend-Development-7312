const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test GlobalLoader
  await page.goto('http://localhost:5173').catch(() => {});
  // It's a bit tricky to capture the loader exactly, but we can try injecting it
  await page.evaluate(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });
  await page.addScriptTag({ content: `
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import GlobalLoader from './src/components/GlobalLoader.jsx';

    const root = createRoot(document.getElementById('root'));
    root.render(<GlobalLoader />);
  `, type: 'module' });
  // wait a bit for it to render
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'globalloader_screenshot.png' });

  await browser.close();
})();
