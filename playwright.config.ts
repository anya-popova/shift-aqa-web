// Импортируем функцию defineConfig (для создания конфигурации) и объект devices (с готовыми настройками устройств) из Playwright
import { defineConfig, devices } from '@playwright/test';

// Экспортируем конфигурацию по умолчанию, чтобы Playwright её использовал
export default defineConfig({
  // Папка, в которой находятся тесты
  testDir: './tests',
  // Запускать тесты полностью параллельно (каждый тест в своём экземпляре браузера)
  fullyParallel: true,
  // Запрещаем использовать test.only в CI, чтобы не пропустить другие тесты
  forbidOnly: !!process.env.CI,
  // Количество повторных прогонов упавших тестов: 2 в CI, 0 локально
  retries: 1,
  // Количество параллельных воркеров: 1 в CI (чтобы не перегружать систему), иначе авто-режим
  workers: 3,
  /*Указание места хранения эталонных скриншотов*/
  snapshotDir: './screenshots/expected',
  // Формат отчёта: HTML-отчёт
  reporter: [
    ['html', { open: 'never' }]
  ],
  // Общие настройки для всех тестов
  use: {
    // Включаем трассировку (trace) при первом повторном прогоне упавшего теста
    trace: 'on-first-retry',
    // Базовый URL, который будет подставляться перед относительными адресами в тестах
    baseURL: 'http://89.169.184.251/'
    // baseURL: 'http://localhost:3000/'
  },

  // Список проектов (разных конфигураций браузеров и устройств), в которых будут запускаться тесты
  projects: [
    {
      // Название проекта для отчётов
      name: 'Desktop chrome - 1920',
      // Настройки для этого проекта
      use: {
        browserName: 'chromium',         // используем браузер Chromium
        viewport: { width: 1920, height: 1080 }  // разрешение экрана как у десктопа
      },
    },
    // {
    //   name: 'Tablet chrome - 1024',
    //   use: {
    //     browserName: 'chromium',
    //     viewport: { width: 1024, height: 1080 }    // разрешение планшета
    //   },
    // },
    {
      name: 'Mobile chrome - 768',
      use: {
        browserName: 'chromium',
        viewport: { width: 768, height: 1080 }     // разрешение мобильного устройства
      },
    },
    {
      name: 'Mobile chrome - 360',
      use: {
        browserName: 'chromium',
        viewport: { width: 360, height: 1080 }     // разрешение мобильного устройства
      },
    }, 
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },     // Эмуляция мобильного девайса iphone 12 safari
    // }
  ],
      // Конфигурация ожидаемых результатов для скрин-тестов
  expect: {
    toHaveScreenshot: {
      threshold: 0.2, // 0.2% отличий (по умолчанию)
      maxDiffPixels: 100, // максимум отличий по пикселям
      maxDiffPixelRatio: 0.02, // 2% отличий от общей площади скриншота
      }
    }
});
