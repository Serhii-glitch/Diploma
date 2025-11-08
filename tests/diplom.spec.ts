import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://praha.itstep.org/');
    await page.locator('#acceptAllCookies').click();
  });

test('Malá počítačová akademie', async ({ page }) => {
  await page.locator('text=Vzdělávací programy').first().hover();
  await page.locator('text=Malá počítačová akademie                                        ').first().click();
  await expect(page.getByText(/Navrženo tak, abychom připravili děti na budoucnost/)).toBeVisible();
});

test('click on logo', async ({ page }) => {
    const link = page.locator('.re-home-adult__link').first();
    await link.scrollIntoViewIfNeeded();
    await link.hover();
    await link.click();
    await expect(page.getByText(/Kurzy/)).toBeVisible();
    await page.locator('[class="logo__img"]').first().click();
    await expect(page.getByText(/Kvalitní vzdělání a vysoká poptávka na trhu práce. To jsou pevné základy pro Váš budoucí úspěch./)).toBeVisible();
});

test('Programování', async ({ page }) => {
    const prog = page.locator('text=4 kurzy').first();
    await prog.scrollIntoViewIfNeeded();
    await prog.hover();
    await prog.click();
    await expect(page.locator('.adult-educ-filter__item.font_lang_cs.adult-educ-filter__item--active')).toBeVisible();
});

test('running strip', async ({ page }) => {
    await page.locator('.re-home-banner__ticker-wrap').first().click();
    await expect(page.getByText(/Domů    /)).toBeVisible();
});

test('Pomůžeme vám s výběrem!', async ({ page }) => {
  await page.getByRole('button', { name: 'Přijďte na konzultaci!' }).click();
  await page.locator('input[placeholder="Jméno"]:visible').fill('VeraTEST');
  await page.locator('input[placeholder="E-mail"]:visible').fill('spr1nt2281557@gmail.com');
  await page.locator('input[placeholder="+420 601 123 456"]:visible').fill('608859480');
  await page.locator('span[class="gdpr-policy__checkbox-icon checkbox-policy new-gdpr-checkbox-color"]:visible').click();
});

test('Check if the video plays smoothly', async ({ page }) => {
  const playButton = page.locator('#play_btn_video_front_end_new');
  await playButton.scrollIntoViewIfNeeded();
  await playButton.click();
  await page.waitForTimeout(3000);
});

test('Check if YouTube video can be paused', async ({ page }) => {

  const playButton = page.locator('#play_btn_video_front_end_new');
  await playButton.waitFor({ state: 'visible', timeout: 10000 });
  await playButton.click();

  const frame = page.frameLocator('iframe[src*="youtube.com/embed/pxPYaVOMqlY"]');
  const video = frame.locator('video');
  await video.waitFor({ state: 'visible', timeout: 10000 });

  const isPaused = await video.evaluate((el) => {
    const v = el as HTMLVideoElement;
    v.pause();
    return v.paused;
  });

  expect(isPaused).toBe(true);
});

test('checking if all student review articles are shown', async ({ page }) => {
  const zobrazit = page.locator('text=Zobrazit více').first();
  await zobrazit.scrollIntoViewIfNeeded();
  await zobrazit.click();
  await expect(page.getByText(/Recenze Studentů            /)).toBeVisible();
});

test('Checking if the course students attended is visible	', async ({ page }) => {
  const zobrazit = page.locator('text=Zobrazit více').first();
  await zobrazit.scrollIntoViewIfNeeded();
  await zobrazit.click();
  await expect(page.getByText(/Recenze Studentů            /)).toBeVisible();
  const link = page.locator('a[href="https://praha.itstep.org/kurz-front-end"]').first();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page.getByText(/Front-End Developer                /)).toBeVisible();
});

test('checking if all company logos are visible', async ({ page }) => {
  const companies = page.locator('div[class="re-home-companies__container students-in-companies__container"]').first();
  await companies.scrollIntoViewIfNeeded();
  await page.locator('text=Zobrazit vše').click();
  await page.waitForTimeout(5000);
  const repeat = page.locator('button[class="students-companies-fix__btn re-btn-transparent--white re-btn-transparent re-home-companies__btn"]').first();
  await repeat.scrollIntoViewIfNeeded();
  await repeat.click();
});

test ('Verification of FAQ (1-st, 2-nd, 3-rd)', async ({ page }) => {
  const faq = page.locator('section[class="direction-new-home-questions__section pt0"]').first();
  await faq.scrollIntoViewIfNeeded();
  const first = page.locator('text=Jaký je rozdíl mezi částečným kurzem a denním kurzem?').first();
  await first.scrollIntoViewIfNeeded();
  await first.click();
  await page.waitForTimeout(3000);
  const first1 = page.locator('text=Jaký je rozdíl mezi částečným kurzem a denním kurzem?').first();
  await first1.scrollIntoViewIfNeeded();
  await first1.click();

  const second = page.locator('text=Kdo může kurz navštěvovat? Existují nějaké věkové nebo znalostní předpoklady?').first();
  await second.scrollIntoViewIfNeeded();
  await second.click();
  await page.waitForTimeout(3000);
  const second2 = page.locator('text=Kdo může kurz navštěvovat? Existují nějaké věkové nebo znalostní předpoklady?').first();
  await second2.scrollIntoViewIfNeeded();
  await second2.click();

  const third = page.locator('text=Budu moct hned pracovat?').first();
  await third.scrollIntoViewIfNeeded();
  await third.click();
  await page.waitForTimeout(3000);
  const third3 = page.locator('text=Budu moct hned pracovat?').first();
  await third3.scrollIntoViewIfNeeded();
  await third3.click();
});

test('footer section', async ({ page, request }) => {

  await page.waitForSelector('.footer-new__top-navigation   a'); // ну понятно, на разных сайтах разные локаторы, но а это ссылки, понятно все.

  const articleBody = page.locator('.footer-new__top-navigation');
  const linkLocators = articleBody.locator('a');
  const linkCount = await linkLocators.count();
  console.log(`🔗 Найдено ссылок внутри .footer-new__top-navigation: ${linkCount}`);

  const links = await linkLocators.elementHandles();

  const checkedLinks: { url: string; status: number }[] = []; // здесь хорощин ссылки
  const badLinks: { url: string; status: number }[] = []; // плохие сломанные

  for (const link of links) {
    const href = await link.getAttribute('href'); // после а идет href

    // Пропускаем невалидные типы ссылок
    if (!href || href.startsWith('.') || href.startsWith('mailto:') || href.startsWith('javascript:') || href.startsWith('tel:')) {
      continue;
    }

    const url = href.startsWith('http') ? href : new URL(href, page.url()).toString();

    try { // Блок трай
      const response = await request.get(url);
      const status = response.status();

      console.log(`🌐 ${url} → ${status}`);
      checkedLinks.push({ url, status });

      if (status < 200 || status >= 300) {
        badLinks.push({ url, status });
      }
    } catch (error) { // блок чек
      console.warn(`⚠️ ${url} → ошибка запроса`);
      checkedLinks.push({ url, status: 0 });
      badLinks.push({ url, status: 0 });
    }
  }

  // 📋 Финальный вывод
  console.log('\n📋 Все проверенные ссылки:');
  checkedLinks.forEach(({ url, status }) => {
    console.log(` - ${url} → ${status}`);
  });

  if (badLinks.length > 0) {
    console.log('\n❌ Битые ссылки:');
    badLinks.forEach(({ url, status }) => {
      console.log(` - ${url} → ${status}`);
    });
  } else {
    console.log('\n✅ Все ссылки успешны!');
  }

  // ❗ Если есть битые — проваливаем тест
  expect(badLinks, 'Обнаружены битые ссылки').toEqual([]);
});

test('Page -Vzdělávací kurzy pro děti a mládež-', async ({ page }) => {
  await page.locator('text=Vzdělávací programy').first().hover();
  await page.locator('text=Vzdělávací kurzy pro děti a mládež                            ').first().click();
  await expect(page.getByText(/Školení pro děti/)).toBeVisible();
});