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

test("missing CMS entries return a 404 status", async ({ request }) => {
  const responses = await Promise.all([
    request.get("/projects/nonexistent-project-slug"),
    request.get("/blog/nonexistent-post-slug"),
  ]);
  for (const response of responses) expect(response.status()).toBe(404);
});

test("FAQ answers can be opened and closed with the keyboard", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.getByRole("heading", { level: 1, name: "Questions, answered." })).toBeVisible();
  const first = page.getByRole("button", { name: "What kinds of projects are a good fit?" });
  const next = page.getByRole("button", { name: "How do I start?" });
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await first.focus();
  await first.press("ArrowDown");
  await expect(next).toBeFocused();
  await next.press("Enter");
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(next).toHaveAttribute("aria-expanded", "true");
  await next.press("Enter");
  await expect(next).toHaveAttribute("aria-expanded", "false");
});

test("article headings show technology icons and link to relevant projects", async ({ page }) => {
  await page.goto("/blog/react-native-or-native");
  const heading = page.getByRole("heading", { name: "The case for React Native" });
  await expect(heading.locator("img")).toHaveAttribute("alt", "React Native");
  await page.getByRole("link", { name: "Expense Tracker prototype" }).click();
  await expect(page).toHaveURL(/\/projects\/expense-tracker$/);
  await expect(page.getByRole("heading", { name: "The problem" })).toBeVisible();
});
