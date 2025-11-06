import { test, expect } from '@playwright/test';

const URL = '/'; // главная страница

test.describe('SEO checks — главная страница', () => {

  // === 1. Базовые технические проверки ===
  test('Базовые технические проверки', async ({ page }) => {
    const response = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    expect(response?.status(), 'HTTP статус страницы должен быть 200').toBe(200);

    // Проверяем meta robots, если он существует
    const robotsTag = page.locator('meta[name="robots"]');
    const hasRobots = await robotsTag.count();
    if (hasRobots > 0) {
      const robotsMeta = await robotsTag.first().getAttribute('content');
      if (robotsMeta && robotsMeta.toLowerCase().includes('noindex')) {
        console.warn('⚠️ На странице установлен meta robots=noindex');
      } else {
        console.log('✅ meta robots найден и не содержит noindex');
      }
    } else {
      console.log('ℹ️ meta[name="robots"] отсутствует — это допустимо');
    }
  });

  // === 2. Теги title и meta description ===
  test('Проверка <title> и <meta name="description">', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const title = await page.title();
    if (!title) console.warn('⚠️ Отсутствует тег <title>');
    else {
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(65);
    }

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    if (!description) console.warn('⚠️ Отсутствует <meta name="description">');
    else {
      expect(description.length).toBeGreaterThan(30);
      expect(description.length).toBeLessThanOrEqual(170);
    }
  });

  // === 3. Заголовки H1 / H2 ===
  test('Проверка H1 и H2', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const h1Count = await page.locator('h1').count();
    if (h1Count === 0) {
      console.warn('⚠️ H1 отсутствует на странице');
    } else {
      const h1Text = (await page.locator('h1').first().innerText()).trim();
      expect(h1Text.length).toBeGreaterThan(5);

      const title = await page.title();
      const common = title.toLowerCase().split(' ')
        .filter(word => h1Text.toLowerCase().includes(word) && word.length > 3);
      if (common.length === 0) {
        console.warn('⚠️ H1 и <title> не имеют общих ключевых слов');
      }
    }

    const h2Count = await page.locator('h2').count();
    if (h2Count === 0) console.warn('⚠️ Нет подзаголовков H2');
  });

  // === 4. Canonical / hreflang ===
  test('Проверка canonical и hreflang', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    if (!canonical) {
      console.warn('⚠️ canonical не найден');
    } else {
      const hostname = canonical.match(/^https?:\/\/([^/]+)/)?.[1];
      if (hostname && !hostname.includes('itstep.org')) {
        console.warn(`⚠️ canonical указывает на другой домен: ${hostname}`);
      }
    }

    const alternates = page.locator('link[rel="alternate"][hreflang]');
    const count = await alternates.count();
    if (count === 0) console.warn('⚠️ alternate/hreflang отсутствуют');
  });

  // === 5. JSON-LD ===
  test('Проверка JSON-LD', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    const scripts = page.locator('script[type="application/ld+json"]');
    const n = await scripts.count();
    for (let i = 0; i < n; i++) {
      const json = await scripts.nth(i).innerText();
      try {
        JSON.parse(json);
      } catch {
        console.warn('⚠️ Ошибка парсинга JSON-LD');
      }
    }
  });

  // === 6. robots.txt и sitemap.xml ===
  test('robots.txt и sitemap.xml доступны', async ({ request, baseURL }) => {
    const robotsUrl = `${baseURL}/robots.txt`;
    const robots = await request.get(robotsUrl);
    if (robots.status() !== 200) {
      console.warn(`⚠️ robots.txt недоступен (статус ${robots.status()})`);
    } else {
      console.log('✅ robots.txt найден');
    }

    const candidates = [
      `${baseURL}/sitemap.xml`,
      `${baseURL}/sitemap_index.xml`,
      `${baseURL}/sitemap-index.xml`,
    ];
    let found = false;
    for (const url of candidates) {
      const res = await request.get(url);
      if (res.status() === 200) {
        found = true;
        console.log(`✅ sitemap найден: ${url}`);
        break;
      }
    }
    if (!found) console.warn('⚠️ sitemap не найден');
  });

  // === 7. Изображения без alt ===
  test('Проверка изображений без alt', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const imgs = page.locator('img');
    const count = await imgs.count();
    if (count === 0) {
      console.warn('ℹ️ На странице нет изображений');
      return;
    }

    let noAlt = 0;
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute('alt');
      if (!alt || !alt.trim()) noAlt++;
    }

    const ratio = count ? noAlt / count : 0;
    if (ratio > 0.5) console.warn(`⚠️ Слишком много изображений без alt: ${noAlt}/${count}`);
    else console.log(`✅ Проверка alt прошла: ${count - noAlt}/${count} изображений имеют alt`);
  });

});
