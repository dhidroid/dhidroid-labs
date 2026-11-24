import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Subscribe } from "./subscribe";

describe("Subscribe", () => {
  it("shows a valid email field and keeps signup disabled without a provider URL", () => {
    render(<Subscribe id="footer-email" />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByRole("button", { name: "Opening soon" })).toBeDisabled();
  });
});
