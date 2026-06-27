const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/admin');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'access_denied_screenshot.png' });

  await browser.close();
})();
