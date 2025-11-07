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
})