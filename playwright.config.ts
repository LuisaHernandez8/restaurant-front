import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para pruebas E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Tiempo máximo que una prueba puede ejecutarse */
  timeout: 30 * 1000,
  expect: {
    /* Tiempo máximo para expect() */
    timeout: 5000
  },
  /* Ejecutar pruebas en paralelo */
  fullyParallel: true,
  /* No ejecutar en CI por defecto */
  forbidOnly: !!process.env.CI,
  /* Reintentar en CI si falla */
  retries: process.env.CI ? 2 : 0,
  /* Número de workers en paralelo */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter a usar */
  reporter: 'html',
  /* Configuración compartida para todos los proyectos */
  use: {
    /* URL base para usar en las acciones como `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    /* Recopilar trace cuando se repite la prueba */
    trace: 'on-first-retry',
    /* Capturas de pantalla solo cuando falla */
    screenshot: 'only-on-failure',
  },

  /* Configurar proyectos para diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Ejecutar el servidor de desarrollo antes de las pruebas */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});


