import { describe, expect, it } from "vitest";
import {
  DEFAULT_NEWSLETTER_DATA,
  renderNewsletterHtml,
  renderNewsletterText,
} from "./newsletter-template";

describe("Newsletter Template Renderer", () => {
  it("renders default template with all placeholders replaced", () => {
    const html = renderNewsletterHtml(DEFAULT_NEWSLETTER_DATA);

    expect(html).toContain("Dhidroid <span style=\"font-style:italic;\">Labs</span>");
    expect(html).toContain(`Issue ${DEFAULT_NEWSLETTER_DATA.issue_number}`);
    expect(html).toContain(DEFAULT_NEWSLETTER_DATA.headline);
    expect(html).toContain(DEFAULT_NEWSLETTER_DATA.article_title);
    expect(html).toContain(DEFAULT_NEWSLETTER_DATA.article_excerpt);
    expect(html).toContain(DEFAULT_NEWSLETTER_DATA.lab_item_1_title);
    expect(html).toContain(DEFAULT_NEWSLETTER_DATA.tip_text);

    // Verify no unrendered merge tags remain
    expect(html).not.toMatch(/{{\s*[a-zA-Z0-9_]+\s*}}/);
  });

  it("replaces customized fields appropriately", () => {
    const customData = {
      subject: "Special Lab Dispatch",
      headline: "Custom Architecture Notes",
      issue_number: "42",
      issue_date: "December 2026",
      first_name: "Alex",
      article_title: "Building Resilient Offline Apps",
      article_excerpt: "A deep dive into local SQLite caching.",
      article_url: "https://example.com/blog/offline",
      lab_item_1_title: "SQLite vs WatermelonDB",
      lab_item_1_text: "Benchmark results on Android devices.",
      tip_text: "Always wrap local transactions in write batches.",
    };

    const html = renderNewsletterHtml(customData);

    expect(html).toContain("<title>Special Lab Dispatch</title>");
    expect(html).toContain("Custom Architecture Notes");
    expect(html).toContain("Issue 42 · December 2026");
    expect(html).toContain("Hi Alex,");
    expect(html).toContain("Building Resilient Offline Apps");
    expect(html).toContain("SQLite vs WatermelonDB");
    expect(html).toContain("Benchmark results on Android devices.");
    expect(html).toContain("Always wrap local transactions in write batches.");
  });

  it("renders readable plain text version for email clients", () => {
    const text = renderNewsletterText({
      issue_number: "05",
      headline: "Fast mobile interfaces",
      first_name: "Jordan",
    });

    expect(text).toContain("Dhidroid Labs");
    expect(text).toContain("Issue 05");
    expect(text).toContain("Notes from the lab: Fast mobile interfaces");
    expect(text).toContain("Hi Jordan,");
    expect(text).toContain("FEATURED ARTICLE:");
    expect(text).toContain("FROM THE LAB:");
    expect(text).toContain("ONE USEFUL IDEA:");
  });
});
