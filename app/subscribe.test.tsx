import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Subscribe } from "./subscribe";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Subscribe", () => {
  it("shows a valid email field and keeps signup disabled without a provider URL", () => {
    render(<Subscribe id="footer-email" />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByRole("button", { name: "Opening soon" })).toBeDisabled();
  });

  it("submits the email and displays the confirmation message", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_API_URL", "https://example.test/newsletterSignup");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Check your inbox to confirm." }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    render(<Subscribe id="footer-email" />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "reader@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Check your inbox to confirm.");
    });
    expect(fetch).toHaveBeenCalledWith(
      "https://example.test/newsletterSignup",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ action: "subscribe", email: "reader@example.com" }),
      })
    );
  });

  it("confirms a subscription token from the newsletter URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_API_URL", "https://example.test/newsletterSignup");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Subscription confirmed." }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    window.history.replaceState(null, "", "/newsletter?confirm=example-token");
    render(<Subscribe id="page-email" confirmFromUrl />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Subscription confirmed.");
    });
    expect(fetch).toHaveBeenCalledWith(
      "https://example.test/newsletterSignup",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ action: "confirm", token: "example-token" }),
      })
    );
  });
});
