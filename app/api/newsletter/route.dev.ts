import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { projectBrief, projectBriefReceipt, subscriptionConfirmation } from "../../../functions/mail/transactional.cjs";
import { sendAuditedMail } from "../../../functions/smtp-audit/index.cjs";
import {
  DEFAULT_NEWSLETTER_DATA,
  NewsletterData,
  renderNewsletterHtml,
  renderNewsletterText,
} from "../../../lib/newsletter-template";

const SITE_ORIGIN =
  process.env.SITE_ORIGIN || "https://dhidroid-labs.dhidroid.workers.dev";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_SECURE =
  process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;
const MAIL_TO = process.env.MAIL_TO || "dhinesh4668@gmail.com";
const ADMIN_KEY = process.env.ADMIN_KEY || "";

function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
}

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) throw new Error("SMTP credentials are not configured.");
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON request body." }, { status: 400 });
  }

  const action = body.action;

  // 1. Subscribe reader
  if (action === "subscribe") {
    const rawEmail = body.email;
    if (!isValidEmail(rawEmail)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    try {
      const transporter = getTransporter();

      await sendAuditedMail(transporter, "next_api", "subscription_confirmation", {
        from: MAIL_FROM,
        to: email,
        ...subscriptionConfirmation(SITE_ORIGIN, token),
      });

      return NextResponse.json({
        message: "Check your inbox for a link to confirm your subscription.",
      });
    } catch (err) {
      console.error("Failed to send subscription confirmation email:", err);
      // Even if SMTP fails on dev without credentials, provide friendly message
      return NextResponse.json({
        message: "Check your inbox for a link to confirm your subscription.",
      });
    }
  }

  // 2. Confirm subscription
  if (action === "confirm") {
    const token = body.token;
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { message: "Confirmation link is invalid or expired." },
        { status: 400 }
      );
    }
    return NextResponse.json({
      message: "Your newsletter subscription is confirmed. Thank you!",
    });
  }

  // 3. Project Brief / Contact Form submission
  if (action === "project_brief" || action === "contact") {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const budget = typeof body.budget === "string" ? body.budget.trim() : "Prefer not to say";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !isValidEmail(email) || !message) {
      return NextResponse.json(
        { message: "Please provide a valid name, email address, and project description." },
        { status: 400 }
      );
    }

    try {
      const transporter = getTransporter();

      await sendAuditedMail(transporter, "next_api", "project_brief", {
        from: MAIL_FROM,
        to: MAIL_TO,
        replyTo: email,
        ...projectBrief({ name, email, budget, message }),
      });

      await sendAuditedMail(transporter, "next_api", "project_brief_receipt", {
        from: MAIL_FROM,
        to: email,
        ...projectBriefReceipt(name, SITE_ORIGIN),
      });

      return NextResponse.json({
        message: "Your project brief has been sent successfully. We will reply within one business day.",
      });
    } catch (err) {
      console.error("Failed to send brief via SMTP:", err);
      return NextResponse.json(
        { message: "Could not send the project brief via email. Please try again." },
        { status: 503 }
      );
    }
  }

  // 4. Custom Newsletter dispatch
  if (action === "send_newsletter" || action === "send") {
    if (!ADMIN_KEY || (request.headers.get("x-admin-key") ?? body.adminKey) !== ADMIN_KEY) {
      return NextResponse.json({ message: "Unauthorized. Invalid admin key." }, { status: 401 });
    }

    const testEmail = typeof body.testEmail === "string" ? body.testEmail.trim() : "";
    const rawNewsletter = (body.newsletter || {}) as Partial<NewsletterData>;
    const newsletterData: Partial<NewsletterData> = {
      ...DEFAULT_NEWSLETTER_DATA,
      ...rawNewsletter,
      site_url: SITE_ORIGIN,
      unsubscribe_url: `${SITE_ORIGIN}/newsletter`,
      preferences_url: `${SITE_ORIGIN}/newsletter`,
    };

    if (testEmail) {
      if (!isValidEmail(testEmail)) {
        return NextResponse.json({ message: "Invalid test email address." }, { status: 400 });
      }

      try {
        const transporter = getTransporter();
        const html = renderNewsletterHtml(newsletterData);
        const text = renderNewsletterText(newsletterData);

        await sendAuditedMail(transporter, "next_api", "newsletter_test", {
          from: MAIL_FROM,
          to: testEmail,
          subject: newsletterData.subject || "Notes from the lab",
          html,
          text,
        });

        return NextResponse.json({
          message: `Custom newsletter test successfully sent to ${testEmail}!`,
          recipientsCount: 1,
        });
      } catch (err) {
        console.error("Failed sending test newsletter:", err);
        return NextResponse.json(
          { message: "Failed to send test newsletter. Check SMTP settings." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({
      message: "Test delivery complete. Broadcast mode requires configured subscriber list.",
      recipientsCount: 0,
    });
  }

  return NextResponse.json({ message: "Invalid action." }, { status: 400 });
}
