const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { chromium } = require(process.env.SKILL_EVAL_PLAYWRIGHT_MODULE || 'playwright');

async function check() {
  const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
  try {
    const page = await browser.newPage();
    await page.route(/^https?:/, route => route.abort());
    const checks = {};
    for (const width of [360, 768]) {
      await page.setViewportSize({ width, height: 400 });
      await page.goto(pathToFileURL(path.join(process.argv[2], 'index.html')).href);
      const button = page.locator('#save');
      const actual = await button.evaluate(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height,
          radius: style.borderRadius, background: style.backgroundColor,
          fontSize: style.fontSize, color: style.color };
      });
      checks[`design_geometry_${width}`] = actual.x === 24 && actual.y === 24 && actual.width === 144 && actual.height === 44;
      checks[`design_styles_${width}`] = actual.radius === '8px' && actual.background === 'rgb(15, 98, 254)' && actual.fontSize === '16px' && actual.color === 'rgb(255, 255, 255)';
      await page.keyboard.press('Tab');
      checks[`keyboard_focus_${width}`] = await button.evaluate(element => document.activeElement === element && getComputedStyle(element).outlineStyle !== 'none' && parseFloat(getComputedStyle(element).outlineWidth) > 0);
      await page.keyboard.press('Enter');
      checks[`activation_${width}`] = await page.locator('#status').textContent() === 'Saved';
    }
    process.stdout.write(JSON.stringify(checks));
  } finally {
    await browser.close();
  }
}

check().catch(error => { console.error(error.message); process.exitCode = 1; });
