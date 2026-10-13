import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Hero
  await page.screenshot({ path: '/home/khalil/cjerf_automotive/assets/preview_hero.png' });
  console.log('Hero screenshot saved');

  // 2. Chamber
  await page.evaluate(() => {
    const el = document.getElementById('scrolly-chamber');
    if (el) window.scrollTo(0, el.offsetTop + 600);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/home/khalil/cjerf_automotive/assets/preview_chamber.png' });
  console.log('Chamber screenshot saved');

  // 3. Pipeline
  await page.evaluate(() => {
    const el = document.getElementById('pipeline');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/home/khalil/cjerf_automotive/assets/preview_pipeline.png' });
  console.log('Pipeline screenshot saved');

  // 4. Catalog
  await page.evaluate(() => {
    const el = document.getElementById('catalogue');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/home/khalil/cjerf_automotive/assets/preview_catalog.png' });
  console.log('Catalog screenshot saved');

  // 5. Configurator
  await page.evaluate(() => {
    const el = document.getElementById('configurateur');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/home/khalil/cjerf_automotive/assets/preview_configurator.png' });
  console.log('Configurator screenshot saved');

  // 6. Mobile Viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/home/khalil/cjerf_automotive/assets/preview_mobile_hero.png' });
  console.log('Mobile hero screenshot saved');

  await browser.close();
}
capture().catch(console.error);
