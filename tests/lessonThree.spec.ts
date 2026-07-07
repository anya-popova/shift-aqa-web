import { test, expect } from '@playwright/test';
import { fillAllFields } from '../helpers/fillAllFields';

test('Smoke test', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json();

    await fillAllFields(page, {code})
    // await page.getByTestId('feedback-input-fullname').fill('афы фыа фыафыа');
    // await page.getByTestId('feedback-input-email').fill('as@asf.qw');
    // await page.getByTestId('feedback-input-phone').fill('+7 988 812 81 877');
    // await page.getByTestId('feedback-input-message').fill('asf asfa asfqfqw');
    // await page.getByTestId('feedback-input-captcha').fill(code);
    // await page.getByTestId('feedback-checkbox-consent').click();
    // await page.getByTestId('feedback-input-message').fill('asf asfa asfqfqwdqw ');
    await page.getByTestId('feedback-submit-button').click();
    
    await expect.soft(page.getByTestId('modal-message')).toBeVisible();
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.');
});

test('Smoke test - заглушка (каптча валидная, но не правильная)', async ({ page }) => {
    await page.route('/api/feedback', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success:true,
                message:'Ваша обратная связь принята'
            })
        })
    })
    await page.goto('feedback');
    await fillAllFields(page)
    await page.getByTestId('feedback-submit-button').click();
    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
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

test('Негативная проверка капчи - < min длины', async ({ page }) => {
    
    let requestSent = false // let- может меняться
    page.on('request', (request) => {
        if (request.url().includes('/api/feedback')) {
            requestSent = true
        }
    })

    await page.goto('feedback');

    await fillAllFields(page, {code: 'qwe'})
    await page.getByTestId('feedback-submit-button').click({force:true});

    await expect.soft(requestSent).toBe(false)

    const captchaErrorSelector = page.getByTestId('feedback-captcha-error')
    await expect.soft(captchaErrorSelector).toHaveText('Капча должна содержать 4 символа')
    await expect.soft(captchaErrorSelector).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).not.toBeVisible()
});



test('Проверка сортировки по возрастанию - текущая страница', async ({ page }) => {
    await page.goto('catalog');
    await page.getByTestId('catalog-sort-select').click();
    await page.getByTestId('catalog-sort-option-asc').click();

    const priceLocator = page.locator('[data-testid^="catalog-product-price-prod-"]');
    await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]');

    const priceElement = await priceLocator.all();
    const prices: number[] = []

    for (const element of priceElement) {
        const price = Number((await element.textContent())?.replace(/[^0-9]/g, ''))
        prices.push(price)
    }

    for (let i = 0; i<prices.length-1; i++){
        console.log(`${prices[i]}<${prices[i+1]}`)
        expect.soft(prices[i]).toBeLessThanOrEqual(prices[i+1])
    }
});

test('Проверка сортировки по возрастанию все страницы', async ({ page }) => {
    await page.goto('catalog');
    await page.getByTestId('catalog-sort-select').click();
    await page.getByTestId('catalog-sort-option-asc').click();
    let lastPrice = 0
    let curentPage = 1
    let hasNextPage = true
    const priceLocator = page.locator('[data-testid^="catalog-product-price-prod-"]')
    await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]')
    while (hasNextPage) {
        const priceElemnt = await priceLocator.all()
        const prices: number[] = []
        for (const element of priceElemnt) {
            const price = Number((await element.textContent())?.replace(/[^0-9]/g, '')) 
            prices.push(price)
        }
        console.log(`//////////////////${lastPrice}<${prices[0]}`)
        expect.soft(lastPrice).toBeLessThanOrEqual(prices[0])
        for (let i = 0; i<prices.length-1; i++) {
            console.log(`${prices[i]}<${prices[i+1]}`)
            expect.soft(prices[i]).toBeLessThanOrEqual(prices[i+1])
        }
        const isDisabled = await page.getByTestId('catalog-pagination-next').isDisabled()
        if (isDisabled) {
            hasNextPage = false
        } else {
            await page.getByTestId('catalog-pagination-next').click()
            await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]')
        }
        lastPrice = prices[prices.length-1]
        curentPage++
    }
    console.log(curentPage)
});

test('Проверка отображения 1 товара', async ({ page }) => {
    await page.route('/api/product**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                pagination: {page: 1, limit: 25, total: 1, totalPages: 1},
                products: [{
                    id: 'prod-001',
                    name: 'Молочный шоколад',
                    price: 599,
                    category: 'chocolate',
                    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzRhMmMyYSIvPgogICAgPHRleHQgeD0iMTAwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZThkNWI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+0JzQvtC70L7Rh9C90YvQuSDRiNC+0LrQvtC70LDQtDwvdGV4dD4KICAgIDx0ZXh0IHg9IjEwMCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjaw8L3RleHQ+CiAgPC9zdmc+'
                }]
            })
        })
    })

    await page.goto('catalog');

    await page.waitForSelector('[data-testid^="catalog-product-card-prod-"]')
    const count = await page.locator('[data-testid^="catalog-product-card-prod-"]').count()
    console.log(count);

    expect.soft(count).toEqual(1)
});
