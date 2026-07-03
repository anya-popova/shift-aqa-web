// import {test, expect} from '@playwright/test'
// import config from '../playwright.config'


// const baseURL = config.use?.baseURL
// if (!baseURL) {
//     throw new Error('baseURL не задан в конфиге')
// }

// test('Проверка перехода на Главную страницу', async ({page}) => {
//     await page.goto('') // пустые кавычки, т.к. в конфиге указан base URL
//     await expect.soft(page).toHaveTitle('Главная') // expect - страница соответствует чему-то
//     await expect.soft(page).toHaveURL(baseURL)
// })
// // один тест под одну задачу, т.к. если завалится одна проверка, вторая не проверяется (хотя soft решает проблему)

// test('Проверка перехода на Cтраницу каталог', async ({page}) => {
//     await page.goto('catalog')
//     await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей') // expect - страница соответствует чему-то
//     await expect.soft(page).toHaveURL(`${baseURL}catalog`)
// })

// test('Проверка URL на Cтранице каталог (через регулярное выражение)', async ({page}) => {
//     await page.goto('catalog')
//     await expect.soft(page).toHaveURL(/.*catalog/)
// })

// test('Проверка текста кнопки перейти в каталог', async ({page}) => {
//     await page.goto('')
//     await expect(page.getByTestId('home-hero-catalog-button')).toHaveText('Перейти в каталог')
//     await expect(page.getByTestId('home-hero-catalog-button')).toContainText('каталог')

// })

// test('Проверка ссылки в логотипе (Хеддер)', async ({page}) => {
//     await page.goto('catalog')
//     await expect(page.getByTestId('header-logo')).toHaveAttribute('href', '/')
// })

// test('Проверка ссылки в логотипе (Хеддер) переход по ссылке', async ({page}) => {
//     await page.goto('catalog')
//     await page.getByTestId('header-logo').click()
//     await expect.soft(page).toHaveTitle('Главная')
//     await expect.soft(page).toHaveURL(baseURL)
// })

// // пример пропуска теста в общем прогоне (есть ещё only, но его не стоит использовать)
// test.skip('Проверка перехода в каталог по кнопке Конфеты', async ({page}) => {
//     await page.goto('')
//     await page.getByTestId('home-category-candy').click()
//     await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей')
//     await expect.soft(page).toHaveURL(`${baseURL}catalog?category=candy`)
//     // await page.waitForTimeout(1000) // кринж, лучше не использовать
//     await page.waitForSelector('[data-testid^="catalog-product-category-prod-"]')
//     const categoryItems = page.locator('[data-testid^="catalog-product-category-prod-"]') // пул идентификаторов
//     const count = await categoryItems.count()
//     for (let i = 0; i < count; i++){
//         const categoryText = await categoryItems.nth(i).textContent()
//         expect.soft(categoryText).toBe('Конфеты')
//     }
// })

// test('Проверка закрытия плашки кук', async ({page}) => {
//     await page.goto('')
//     await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
//     await page.getByTestId('cookie-accept-button').click()
//     await expect.soft(page.getByTestId('cookie-consent-banner')).toBeHidden()
// })