import {test, expect} from '@playwright/test';
import pages from '../data/pages.json';

pages.forEach((testPage: {name: string, url: string}) => {
    
    test(`Страница ${testPage.name}`, async ({page}) => {
    // ({page}) - объект playWright, представляет собой страницу браузера
        
        const width = await page.evaluate(() => window.innerWidth);

        await page.goto(testPage.url); // переход по url
        
        if (testPage.url == '') {
            await expect.soft(page.getByTestId('cookie-consent-banner')).toHaveScreenshot('Плашка кук.png');
            await page.getByTestId('cookie-accept-button').click();
            
            if (width <= 768) {
                await page.getByTestId('header-burger-menu-button').click();
                await expect.soft(page.getByTestId('header-mobile-menu')).toHaveScreenshot('Бургер меню.png');
                await page.getByTestId('header-burger-menu-button').click();
            }
        } else {
            await page.getByTestId('cookie-accept-button').click();
        }

        await expect.soft(page).toHaveScreenshot({
            fullPage: true, // скриншоты всей страницы целиком
            mask: [
                page.locator('[data-testid^="catalog-product-price-prod-"]'),
                page.getByTestId('feedback-captcha-image')
            ]
        });
    })
});