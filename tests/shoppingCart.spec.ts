import {test, expect} from '@playwright/test';

test('Корзина пустая', async ({ page }) => {

    await page.goto('/cart');
    await expect.soft(page).toHaveScreenshot();
});

test('Корзина с одним товаром (Шоколад с орехами)', async ({ page }) => {

    await page.goto('/catalog');
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();
    await page.getByTestId('header-cart-button').click();
    await page.getByTestId('cookie-accept-button').click();
    await expect.soft(page).toHaveScreenshot({
        fullPage: true,
            mask: [
                // хочется замаскировать и цену на конкретный товар в корзине, но у него нет data-testid :((
                // наверное нужно делать допустимое отклонение пикселей, или есть другое умное решение?
                page.getByTestId('cart-total-price'),
                page.getByTestId('cart-captcha-image')
            ]
    });
});