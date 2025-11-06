import { test, expect } from '@playwright/test';

test.describe('e2e test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://praha.itstep.org/');
    await page.locator('#acceptAllCookies').click();
  });

  test('random course selection ', async ({ page }) => {
    // Наводим курсор на меню
    await page.locator('text=Vzdělávací programy').first().hover();

    const links = [
      page.locator('a[href="/ui-ux"]'),
      page.locator('a[href="/project-management"]'),
      page.locator('a[href="/course-for-software-testers"]'),
      page.locator('a[href="/computer-graphics-and-design"]'),
      page.locator('a[href="/programming-in-python-ai-direction"]'),
      page.locator('a[href="/no-code-developer"]')
    ];

    const buttonTexts = [
      'Přihlaste se do našeho kurzu',
      'Přihlaste se do kurzu',
      'Přihlaste se do kurzu',
      'Přihlaste se do kurzu',
      'Zarezervujte si místo',
      'Přihlaste se do kurzu'
    ];

    // Случайный выбор ссылки
    const randomIndex = Math.floor(Math.random() * links.length);
    const selectedLink = links[randomIndex].first();
    const buttonText = buttonTexts[randomIndex];

    // Получаем href
    const href = await selectedLink.getAttribute('href');
    if (!href) throw new Error('Href not found on the selected link');
    const hrefStr = href as string;

    // Переход на страницу
    await selectedLink.hover();
    await selectedLink.click();
    await expect(page).toHaveURL(new RegExp(hrefStr));

    // Наводим на кнопку и кликаем по тексту
    const button = page.locator(`text=/\\s*${buttonText}\\s*/`);
    await button.first().scrollIntoViewIfNeeded();
    await button.first().hover();
    await button.first().click();
    await expect(page.getByText(/Nechte nám na Vás kontakt/)).toBeVisible();
    
    await page.getByPlaceholder('Jméno').first().fill('Testovací uživatel');

    const phoneInput = page.getByPlaceholder('+420 601 123 456').first();
    await page.waitForSelector('input[placeholder="+420 601 123 456"]', {
      state: 'visible',
      timeout: 10000
    });
    await phoneInput.click({ trial: true }); 
    await phoneInput.click(); 
    await phoneInput.fill('608 985 048');

    await page.getByPlaceholder('email').first().fill('SERHIItester@gmail.com');

    await page.locator('[name="SiteForm[dropdown]"]').first().selectOption('emailem   ');
    
    await page.locator('.gdpr-policy__label').first().click();
  });

});
