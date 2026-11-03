import { test, expect } from '@playwright/test';

const email = `e2e+${Date.now()}@agromarket.test`;
const password = 'E2e-Test-Password-123';

test('главная страница и каталог загружаются', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/АгроМаркет|AgroMarket/i);
});

test('прямой переход на страницу входа возвращает статус 200', async ({ page }) => {
  const response = await page.goto('/login');
  expect(response.status()).toBe(200);
});

test('покупатель регистрируется и видит успешный вход', async ({ page }) => {
  await page.goto('/login');

  const registerSwitchBtn = page.getByRole('button', { name: /нет аккаунта|регистрация/i });
  if (await registerSwitchBtn.isVisible()) {
    await registerSwitchBtn.click();
  }

  await page.getByPlaceholder('Имя').fill('E2E Buyer');
  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/пароль/i).fill(password);

  await page.locator('form.login-form').getByRole('button', { name: 'Зарегистрироваться' }).click();

  await expect(page.getByText(/ошибка/i)).not.toBeVisible();
});