import {test, expect} from '@playwright/test';

test('Раскрытый бургер ответа на вопрос на старнице FAQ', async ({ page }) => {

    await page.goto('/faq');
    await page.getByTestId('faq-question-1').click();
    await expect.soft(page).toHaveScreenshot({
        fullPage: true,
    });
});
