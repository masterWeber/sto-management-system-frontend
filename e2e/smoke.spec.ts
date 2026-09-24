import { expect, test } from "@playwright/test";

test("неавторизованный пользователь перенаправляется на страницу входа", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole("heading", { name: "СТО — вход" }),
  ).toBeVisible();
  await expect(page.getByLabel("Логин")).toBeVisible();
  await expect(page.getByLabel("Пароль")).toBeVisible();
});

test("форма входа показывает валидацию при пустых полях", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Войти" }).click();
  await expect(page.getByText("Введите логин")).toBeVisible();
  await expect(page.getByText("Введите пароль")).toBeVisible();
});
