import {test, expect} from '@playwright/test';


test('Корзина с одним товаром (Шоколад с орехами)', async ({ page }) => {

    await page.goto('/catalog');
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();
    await page.getByTestId('header-cart-button').click();
    await page.getByTestId('cookie-accept-button').click();
    await expect.soft(page).toHaveScreenshot({
        fullPage: true,
            mask: [
                page.locator('.text-sm.font-semibold.text-primary'), // уникальный класс цен товаров в корзине
                page.getByTestId('cart-total-price'),
                page.getByTestId('cart-captcha-image')
            ]
    });
});
