import { test, expect } from '@playwright/test';
import { fillAllFields } from '../helpers/fillAllFields';

test('Проверка сортировки по убыванию - текущая страница', async ({ page }) => {
    await page.goto('catalog');
    await page.getByTestId('catalog-sort-select').click();
    await page.getByTestId('catalog-sort-option-desc').click();

    const priceLocator = page.locator('[data-testid^="catalog-product-price-prod-"]');
    await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]');

    const priceElement = await priceLocator.all();
    const prices: number[] = []

    for (const element of priceElement) {
        const price = Number((await element.textContent())?.replace(/[^0-9]/g, ''))
        prices.push(price)
    }

    for (let i = 0; i < prices.length - 1; i++) {
        console.log(`${prices[i]}>${prices[i + 1]}`)
        expect.soft(prices[i]).toBeGreaterThanOrEqual(prices[i + 1])
    }
});

test('Проверка сортировки по убыванию все страницы', async ({ page }) => {
    await page.goto('catalog');
    await page.getByTestId('catalog-sort-select').click();
    await page.getByTestId('catalog-sort-option-desc').click();
    let lastPrice = null; // думала задать просто 99999, но мне кажется так логичнее
    let curentPage = 1;
    let hasNextPage = true;
    const priceLocator = page.locator('[data-testid^="catalog-product-price-prod-"]');
    await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]');
    while (hasNextPage) {
        const priceElemnt = await priceLocator.all();
        const prices: number[] = [];
        for (const element of priceElemnt) {
            const price = Number((await element.textContent())?.replace(/[^0-9]/g, ''));
            prices.push(price);
        }

        // если lastPrice только инициализирована
        if (lastPrice === null) {
            lastPrice = prices[0];
        }
        console.log(`//////////////////${lastPrice}>=${prices[0]}`)
        expect.soft(lastPrice).toBeGreaterThanOrEqual(prices[0])
        for (let i = 0; i < prices.length - 1; i++) {
            console.log(`${prices[i]}>=${prices[i + 1]}`)
            expect.soft(prices[i]).toBeGreaterThanOrEqual(prices[i + 1])
        }
        const isDisabled = await page.getByTestId('catalog-pagination-next').isDisabled()
        if (isDisabled) {
            hasNextPage = false
        } else {
            await page.getByTestId('catalog-pagination-next').click()
            await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]')
        }
        lastPrice = prices[prices.length - 1]
        curentPage++
    }
    console.log(curentPage)
});


// проверка поля ФИО
test.describe('Проверка формы обратной связи с валидными именами', () => {
    // вероятно, поскольку в дальнейшем с заказчиком связывается менеджер для уточнения деталей, ввод неполного ФИО допустим
    const fullnamesValid = [
        'Петров Петр Петрович',
        'Иванов Петр Сергеевич младший',
        'Петр Смирнов-Соколов',
        'ПЕТР',
        'петр',
        'Petrov Petr Petrovich',
        'П'
    ];

    fullnamesValid.forEach((fullname) => {
        test(`Введено ФИО: ${fullname}`, async ({ page, request }) => {

            const captchaResponsePromise = page.waitForResponse((response) =>
                response.url().includes("/api/captcha")
            )

            await page.goto('feedback');

            const captchaResponse = await captchaResponsePromise
            const { id } = await captchaResponse.json()
            const { code } = await (await request.get(`/api/testing/captcha?id=${id}`)).json();

            await fillAllFields(page, { fullname, code })
            await page.getByTestId('feedback-submit-button').click();

            await expect.soft(page.getByTestId('modal-message')).toBeVisible();
            await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.');
        });
    });
});

test.describe('Проверка формы обратной связи с ФИО с запрещёнными символами', () => {

    const fullnamesNotValid = [
        'Петров Петр Петрович1',
        'Петров_Петр_Петрович',
    ];

    fullnamesNotValid.forEach((fullname) => {
        test(`Введено ФИО: ${fullname}`, async ({ page, request }) => {

            let requestSent = false;
            const captchaResponsePromise = page.waitForResponse((response) =>
                response.url().includes("/api/captcha")
            )

            await page.goto('feedback');

            const captchaResponse = await captchaResponsePromise;
            const { id } = await captchaResponse.json();
            const { code } = await (await request.get(`/api/testing/captcha?id=${id}`)).json();

            await fillAllFields(page, { fullname, code })
            await page.getByTestId('feedback-submit-button').click({ force: true });

            await expect.soft(requestSent).toBe(false)

            const fullnameErrorSymbol = page.getByTestId('feedback-error-fullname');
            await expect.soft(fullnameErrorSymbol).toHaveText('ФИО может содержать только буквы, пробелы и дефисы');
            await expect.soft(fullnameErrorSymbol).toBeVisible();
            await expect.soft(page.getByTestId('modal-message')).not.toBeVisible();
        });
    });
});



test('Проверка формы обратной связи с ФИО длиной > 70 символов', async ({ page, request }) => {

    const fullname = 'p'.repeat(72);
    let requestSent = false;
    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');

    const captchaResponse = await captchaResponsePromise;
    const { id } = await captchaResponse.json();
    const { code } = await (await request.get(`/api/testing/captcha?id=${id}`)).json();

    await fillAllFields(page, { fullname, code })
    await page.getByTestId('feedback-submit-button').click({ force: true });

    await expect.soft(requestSent).toBe(false)

    const fullnameErrorSymbol = page.getByTestId('feedback-error-fullname');
    await expect.soft(fullnameErrorSymbol).toHaveText('ФИО не должно превышать 70 символов');
    await expect.soft(fullnameErrorSymbol).toBeVisible();
    await expect.soft(page.getByTestId('modal-message')).not.toBeVisible();
});

test('Smoke test - проверка 500 ответа', async ({ page }) => {
    await page.route('/api/feedback', async (route) => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
                error: 'Internal Server Error'
            })
        })
    })
    await page.goto('feedback');

    await fillAllFields(page);
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible();
    await expect.soft(page.getByTestId('modal-message')).toContainText('Internal Server Error');
});
