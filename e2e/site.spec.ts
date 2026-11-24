import { expect, test } from "@playwright/test";

test("homepage links to the project enquiry page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /build something useful/i })
  ).toBeVisible();
  await page.getByRole("link", { name: "Start a project" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(
    page.getByRole("heading", { name: "Send a project brief" })
  ).toBeVisible();
});

test("contact form exposes the required enquiry fields", async ({ page }) => {
  await page.goto("/contact");

  await expect(page.getByRole("textbox", { name: "Your name" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email address" })).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Tell us about your project" })
  ).toBeVisible();
});
