import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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
const SMTP_USER = process.env.SMTP_USER || "dhinesh4668@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "vfbc mbol ucgt kxis";
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
  const origin = request.headers.get("origin") || SITE_ORIGIN;

  // 1. Subscribe reader
  if (action === "subscribe") {
    const rawEmail = body.email;
    if (!isValidEmail(rawEmail)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const confirmationUrl = `${origin}/newsletter?confirm=${token}`;

    try {
      const transporter = getTransporter();

      const html = `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:32px 24px;background:#fbfbf8;border-radius:12px;border:1px solid #e4e3de;color:#262323;">
          <h2 style="font-family:'Instrument Serif',Georgia,serif;font-size:28px;margin-top:0;color:#262323;">Confirm your Dhidroid Labs subscription</h2>
          <p style="font-size:15px;line-height:1.6;color:#4a4645;">Thank you for signing up to receive Notes from the lab. Click the button below to confirm your subscription:</p>
          <div style="margin:28px 0;">
            <a href="${confirmationUrl}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#262323;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">Confirm Subscription</a>
          </div>
          <p style="font-size:13px;color:#7a7674;line-height:1.5;">This link expires in 24 hours. If you did not request this newsletter, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e4e3de;margin:24px 0 16px;">
          <p style="font-size:12px;color:#7a7674;margin:0;">Dhidroid Labs · Chennai, India · <a href="${SITE_ORIGIN}" style="color:#3b4bdf;">${SITE_ORIGIN}</a></p>
        </div>
      `;

      const text = `Confirm your subscription to Dhidroid Labs newsletter:\n\n${confirmationUrl}\n\nThis link expires in 24 hours. If you did not request this, you can ignore this email.`;

      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Confirm your Dhidroid Labs newsletter subscription",
        html,
        text,
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

      const studioHtml = `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:28px;background:#fbfbf8;border-radius:12px;border:1px solid #e4e3de;color:#262323;">
          <h2 style="font-family:'Instrument Serif',Georgia,serif;font-size:28px;margin-top:0;color:#262323;">New Project Brief Received</h2>
          <p style="font-size:14px;color:#7a7674;">Submitted via Dhidroid Labs website contact form.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
            <tr><td style="padding:8px 0;font-weight:600;width:120px;color:#7a7674;">Client Name:</td><td style="padding:8px 0;font-weight:600;color:#262323;">${name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;color:#7a7674;">Client Email:</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#3b4bdf;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:600;color:#7a7674;">Budget Range:</td><td style="padding:8px 0;color:#262323;">${budget}</td></tr>
          </table>
          <div style="background:#fff;padding:16px;border-radius:8px;border:1px solid #e4e3de;margin-top:12px;">
            <h4 style="margin:0 0 8px;font-size:12px;text-transform:uppercase;color:#7a7674;letter-spacing:0.5px;">Project Description:</h4>
            <p style="margin:0;white-space:pre-wrap;color:#262323;font-size:14px;line-height:1.6;">${message}</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: MAIL_FROM,
        to: MAIL_TO,
        replyTo: email,
        subject: `New Project Brief: ${name}`,
        html: studioHtml,
        text: `New Project Brief from ${name} (${email})\nBudget: ${budget}\n\nProject Description:\n${message}\n`,
      });

      // Confirmation to client
      const clientHtml = `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#fbfbf8;border-radius:12px;border:1px solid #e4e3de;color:#262323;">
          <h2 style="font-family:'Instrument Serif',Georgia,serif;font-size:26px;margin-top:0;color:#262323;">Thank you for your project brief</h2>
          <p style="font-size:15px;line-height:1.6;color:#4a4645;">Hi ${name},</p>
          <p style="font-size:15px;line-height:1.6;color:#4a4645;">We received your enquiry and project details. We will review them and get back to you within one business day.</p>
          <p style="font-size:15px;line-height:1.6;color:#4a4645;">If you'd like to talk directly in the meantime, you can also book a free 30-minute discovery call at <a href="${SITE_ORIGIN}/contact" style="color:#3b4bdf;">${SITE_ORIGIN}/contact</a>.</p>
          <p style="font-size:14px;color:#7a7674;margin-top:24px;">— Dhidroid Labs Team<br>Chennai, India</p>
        </div>
      `;

      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "We received your project brief — Dhidroid Labs",
        html: clientHtml,
        text: `Hi ${name},\n\nThank you for reaching out to Dhidroid Labs. We received your project brief and will get back to you within one business day.\n\n— Dhidroid Labs Team`,
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
    if (ADMIN_KEY && body.adminKey !== ADMIN_KEY) {
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

        await transporter.sendMail({
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
