const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/auth');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'auth_gateway_screenshot.png' });

  await browser.close();
})();
