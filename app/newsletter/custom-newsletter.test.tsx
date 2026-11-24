import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CustomNewsletter } from "./custom-newsletter";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("CustomNewsletter Component", () => {
  it("renders composer form with sample issue data and preview", () => {
    render(<CustomNewsletter />);

    expect(screen.getByLabelText("Issue Number")).toHaveValue("01");
    expect(screen.getByLabelText("Email Subject")).toHaveValue("Notes from the lab · Issue 01");
    expect(screen.getByLabelText("Article Title")).toHaveValue(
      "React Modernization: Where to Begin Without a Full Rewrite"
    );
    expect(screen.getByTitle("Newsletter Preview")).toBeInTheDocument();
  });

  it("submits custom newsletter test email via endpoint", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_API_URL", "https://example.test/newsletterSignup");
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          message: "Custom newsletter test successfully sent to test@example.com!",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
    vi.stubGlobal("fetch", mockFetch);

    render(<CustomNewsletter />);

    // Provide test email
    const testEmailInput = screen.getByLabelText("Recipient Test Email");
    fireEvent.change(testEmailInput, { target: { value: "test@example.com" } });

    fireEvent.change(screen.getByLabelText("Admin Key"), { target: { value: "test-admin-key" } });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: "Send Test Newsletter" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Custom newsletter test successfully sent to test@example.com!"
      );
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.test/newsletterSignup",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "X-Admin-Key": "test-admin-key" }),
        body: expect.stringContaining('"action":"send_newsletter"'),
      })
    );
  });

  it("submits broadcast newsletter to all confirmed subscribers", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_API_URL", "https://example.test/newsletterSignup");
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          message: "Custom newsletter sent: 12 delivered, 0 failed out of 12 confirmed subscribers.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
    vi.stubGlobal("fetch", mockFetch);

    render(<CustomNewsletter />);

    // Switch to broadcast mode
    const broadcastRadio = screen.getByLabelText("Broadcast to Confirmed Subscribers");
    fireEvent.click(broadcastRadio);
    fireEvent.change(screen.getByLabelText("Admin Key"), { target: { value: "test-admin-key" } });

    const submitBtn = screen.getByRole("button", {
      name: "Broadcast Custom Newsletter",
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Custom newsletter sent: 12 delivered, 0 failed out of 12 confirmed subscribers."
      );
    });
  });
});
