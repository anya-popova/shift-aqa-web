import {test, expect} from '@playwright/test'
import config from '../playwright.config'


const baseURL = config.use?.baseURL
if (!baseURL) {
    throw new Error('baseURL не задан в конфиге')
}


test('Проверка ссылки в логотипе (Хеддер)', async ({page}) => {
    await page.goto('catalog')
    await expect(page.getByTestId('header-logo')).toHaveAttribute('href', '/')
})

test('Проверка ссылки в логотипе (Хеддер) переход по ссылке', async ({page}) => {
    await page.goto('catalog')
    await page.getByTestId('header-logo').click()
    await expect.soft(page).toHaveTitle('Главная')
    await expect.soft(page).toHaveURL(baseURL)
})

test('Проверка перехода по ссылке кнопка Корзина (Хеддер)', async ({page}) => {
    await page.goto('cart')
    await page.getByTestId('header-cart-button').click()
    await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей')
    await expect.soft(page).toHaveURL(baseURL+'cart')
})

// сделала с проверкой текущего размера окна. Это ведь имеет смысл?
// стоит ли сделать проверку размера окна один раз и выполнять тесты по условию viewport.width >= 1024?
// вероятно, этот вопрос разберём на следующе практике, но тем не менее оставлю пока что есть :))
// И стоит ли делать отдельно так много однотипных тестов?

test('Проверка перехода по ссылкам кнопок Хеддера (ширина окна >1024)', async ({page}) => {
    await page.goto(baseURL+'feedback')
    const viewport = page.viewportSize();

    if (viewport) {
        console.log(`Текущая ширина: ${viewport.width}, высота: ${viewport.height}`);
        if (viewport.width >= 1024) {
            const expectedTexts = ['Главная', 'Каталог', 'Акции', 'Доставка', 'О нас', 'Контакты', 'Обратная связь', 'FAQ']
            const elementsHeaderMenu = page.locator('[data-testid^="header-nav-link-"]')
            const count = await elementsHeaderMenu.count()

            // Проверка кнопки Главная (отдельно, т.к. от toHaveURL ожидаем baseURL, ...
            // title просто Главная и тест начинаем не с главной старницы)
            await page.goto(baseURL+'feedback')
            await expect.soft(page.getByTestId('header-nav-link-home')).toBeVisible()
            await page.getByTestId('header-nav-link-home').click()
            await expect.soft(page).toHaveTitle('Главная')
            await expect.soft(page).toHaveURL(baseURL)

            for (let i = 1; i < count; i++){
                const elementTestId = await elementsHeaderMenu.nth(i).getAttribute('data-testid')
                // console.log(elementTestId)
                const elementIdSuffix = elementTestId?.replace('header-nav-link-', '')

                await page.getByTestId('header-nav-link-'+elementIdSuffix).click()
                // странно, что не работает await page.getByTestId(elementTestId).click()

                await expect.soft(page).toHaveURL(baseURL+elementIdSuffix)
                // проверка текста кнопки и title (вероятно, ожидается такая логика title. Но не уверена, тут я бы уточнила)
                const elementText = await elementsHeaderMenu.nth(i).textContent()
                expect.soft(elementText).toBe(expectedTexts[i])
                await expect.soft(page).toHaveTitle(expectedTexts[i]+' | СладкийДом')
                }
            }
        }
    })


test('Проверка перехода по ссылке кнопка Главная (Хеддер) (ширина окна >1024)', async ({page}) => {
    await page.goto(baseURL+'feedback')

    const viewport = page.viewportSize();
    if (viewport) {
        console.log(`Текущая ширина: ${viewport.width}, высота: ${viewport.height}`);
        if (viewport.width >= 1024) {
            await expect.soft(page.getByTestId('header-nav-link-home')).toBeVisible()
            await page.getByTestId('header-nav-link-home').click()
            await expect.soft(page).toHaveTitle('Главная')
            await expect.soft(page).toHaveURL(baseURL)
        }
    }
})

test('Проверка перехода по ссылке кнопка Каталог (Хеддер) (ширина окна >1024)', async ({page}) => {
    await page.goto('')

    const viewport = page.viewportSize();
    if (viewport) {
        if (viewport.width >= 1024) {
            await expect.soft(page.getByTestId('header-nav-link-catalog')).toBeVisible()
            await page.getByTestId('header-nav-link-catalog').click()
            await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей')
            await expect.soft(page).toHaveURL(baseURL+'catalog')
        }
    }
})

test('Проверка перехода по ссылке кнопка Акции (Хеддер) (ширина окна >1024)', async ({page}) => {
    await page.goto('')

    const viewport = page.viewportSize();
    if (viewport) {
        if (viewport.width >= 1024) {
            await expect.soft(page.getByTestId('header-nav-link-promotions')).toBeVisible()
            await page.getByTestId('header-nav-link-promotions').click()
            await expect.soft(page).toHaveTitle('Акции | СладкийДом')
            await expect.soft(page).toHaveURL(baseURL+'promotions')
        }
    }
})

test('Проверка перехода по ссылке кнопка Доставка (Хеддер) (ширина окна >1024)', async ({page}) => {
    await page.goto('')

    const viewport = page.viewportSize();
    if (viewport) {
        if (viewport.width >= 1024) {
            await expect.soft(page.getByTestId('header-nav-link-delivery')).toBeVisible()
            await page.getByTestId('header-nav-link-delivery').click()
            await expect.soft(page).toHaveTitle('Доставка и оплата | СладкийДом')
            await expect.soft(page).toHaveURL(baseURL+'delivery')
        }
    }
})

test('Проверка перехода по ссылке кнопка О нас (Хеддер) (ширина окна >1024)', async ({page}) => {
    await page.goto('')

    const viewport = page.viewportSize();
    if (viewport) {
        if (viewport.width >= 1024) {
            await expect.soft(page.getByTestId('header-nav-link-about')).toBeVisible()
            await page.getByTestId('header-nav-link-about').click()
            await expect.soft(page).toHaveTitle('О компании | СладкийДом')
            await expect.soft(page).toHaveURL(baseURL+'about')
        }
    }
})

test('Проверка перехода по ссылке кнопка Контакты (Хеддер) (ширина окна >1024)', async ({page}) => {
    await page.goto('')

    const viewport = page.viewportSize();
    if (viewport) {
        if (viewport.width >= 1024) {
            await expect.soft(page.getByTestId('header-nav-link-contacts')).toBeVisible()
            await page.getByTestId('header-nav-link-contacts').click()
            await expect.soft(page).toHaveTitle('Контакты | СладкийДом')
            await expect.soft(page).toHaveURL(baseURL+'contacts')
        }
    }
})

test('Проверка перехода по ссылке кнопка Обратная связь (Хеддер) (ширина окна >1024)', async ({page}) => {
    await page.goto('')

    const viewport = page.viewportSize();
    if (viewport) {
        if (viewport.width >= 1024) {
            await expect.soft(page.getByTestId('header-nav-link-feedback')).toBeVisible()
            await page.getByTestId('header-nav-link-feedback').click()
            await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей')
            await expect.soft(page).toHaveURL(baseURL+'feedback')
        }
    }
})

test('Проверка перехода по ссылке кнопка FAQ (Хеддер) (ширина окна >1024)', async ({page}) => {
    await page.goto('')

    const viewport = page.viewportSize();
    if (viewport) {
        if (viewport.width >= 1024) {
            await expect.soft(page.getByTestId('header-nav-link-faq')).toBeVisible()
            await page.getByTestId('header-nav-link-faq').click()
            await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей')
            await expect.soft(page).toHaveURL(baseURL+'faq')
        }
    }
})
// у страниц Каталог, Обратная связь и FAQ нет особых title, когда у остальных страниц из кнопок меню есть

test('Проверка закрытия плашки кук', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
    await page.getByTestId('cookie-decline-button').click()
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeHidden()
})

test('Проверка перехода на страницу Политики конфиденциальности в плашке кук', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-privacy-link')).toBeVisible()
    await page.getByTestId('cookie-consent-privacy-link').click()
    await expect.soft(page).toHaveURL(baseURL+'privacy')
})

// На странице Каталог:
// - возможен выбор категории товаров (Все, Шоколад, Конфеты, Печенье, Торты, Мармелад, Зефир)
// - возможно ранжирование товаров выбранной категории по цене (По умолч-ю, по возростанию и убыванию цены)
// - все товары отображаются сеткой, одновременно может отображаться не более 25 товаров
// - реализована числовая пагинация при просмотре товаров
// - цены на товары в руб/кг