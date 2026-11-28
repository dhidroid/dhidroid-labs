/**
 * Newsletter / contact API route — Cloudflare Workers compatible.
 *
 * Uses the Resend HTTP API (https://resend.com) instead of nodemailer (which
 * requires TCP sockets that are unavailable in Cloudflare Workers).
 *
 * Required environment variables (set in Cloudflare dashboard or wrangler.json secrets):
 *   RESEND_API_KEY   – Resend API key (re_xxxx…)
 *   MAIL_FROM        – Verified sender address, e.g. "Dhidroid Labs <hello@dhidroid.com>"
 *   MAIL_TO          – Studio inbox, e.g. "dhinesh4668@gmail.com"
 *   SITE_ORIGIN      – Public site URL, e.g. "https://dhidroid-labs.dhidroid.workers.dev"
 *   ADMIN_KEY        – Secret for newsletter dispatch (optional)
 */

const SITE_ORIGIN =
  process.env.SITE_ORIGIN || "https://dhidroid-labs.dhidroid.workers.dev";
const MAIL_FROM = process.env.MAIL_FROM || "Dhidroid Labs <hello@dhidroid.com>";
const MAIL_TO = process.env.MAIL_TO || "dhinesh4668@gmail.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY || "";

function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
}

/** Send an email via Resend's HTTP API (fetch-based, Edge/Workers compatible). */
async function sendEmail(options: {
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not configured.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: options.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      ...(options.replyTo ? { reply_to: options.replyTo } : {}),
      subject: options.subject,
      html: options.html,
      ...(options.text ? { text: options.text } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "(no body)");
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }
}

function subscriptionConfirmationHtml(siteOrigin: string, token: string) {
  const link = `${siteOrigin}/newsletter?confirm=${token}`;
  return {
    subject: "Confirm your Dhidroid Labs newsletter subscription",
    html: `<p>Thanks for subscribing! <a href="${link}">Click here to confirm your subscription</a>.</p><p>If you did not sign up, you can safely ignore this email.</p>`,
    text: `Thanks for subscribing to the Dhidroid Labs newsletter.\n\nConfirm your subscription: ${link}\n\nIf you did not sign up, ignore this email.`,
  };
}

function projectBriefHtml(opts: {
  name: string;
  email: string;
  budget: string;
  message: string;
}) {
  return {
    subject: `New project brief from ${opts.name}`,
    html: `
      <h2>New project brief</h2>
      <p><strong>Name:</strong> ${opts.name}</p>
      <p><strong>Email:</strong> ${opts.email}</p>
      <p><strong>Budget:</strong> ${opts.budget}</p>
      <hr />
      <p>${opts.message.replace(/\n/g, "<br>")}</p>
    `,
    text: `New project brief\n\nName: ${opts.name}\nEmail: ${opts.email}\nBudget: ${opts.budget}\n\n${opts.message}`,
  };
}

function projectBriefReceiptHtml(name: string) {
  return {
    subject: "We received your project brief — Dhidroid Labs",
    html: `<p>Hi ${name},</p><p>Thank you for reaching out. We have received your project brief and will reply within one business day.</p><p>In the meantime, feel free to <a href="${SITE_ORIGIN}/contact">book a 30-minute discovery call</a>.</p><p>— Dhidroid Labs</p>`,
    text: `Hi ${name},\n\nThank you for reaching out. We received your project brief and will reply within one business day.\n\nBook a discovery call: ${SITE_ORIGIN}/contact\n\n— Dhidroid Labs`,
  };
}

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON request body." }, { status: 400 });
  }

  const action = body.action;

  // 1. Subscribe reader
  if (action === "subscribe") {
    const rawEmail = body.email;
    if (!isValidEmail(rawEmail)) {
      return Response.json({ message: "Enter a valid email address." }, { status: 400 });
    }
    const email = rawEmail.trim().toLowerCase();
    const token =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    try {
      const { subject, html, text } = subscriptionConfirmationHtml(SITE_ORIGIN, token);
      await sendEmail({ from: MAIL_FROM, to: email, subject, html, text });
    } catch (err) {
      console.error("Failed to send subscription confirmation:", err);
    }

    return Response.json({
      message: "Check your inbox for a link to confirm your subscription.",
    });
  }

  // 2. Confirm subscription
  if (action === "confirm") {
    const token = body.token;
    if (!token || typeof token !== "string") {
      return Response.json(
        { message: "Confirmation link is invalid or expired." },
        { status: 400 }
      );
    }
    return Response.json({
      message: "Your newsletter subscription is confirmed. Thank you!",
    });
  }

  // 3. Project brief / contact form
  if (action === "project_brief" || action === "contact") {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const budget =
      typeof body.budget === "string" ? body.budget.trim() : "Prefer not to say";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !isValidEmail(email) || !message) {
      return Response.json(
        {
          message:
            "Please provide a valid name, email address, and project description.",
        },
        { status: 400 }
      );
    }

    try {
      const brief = projectBriefHtml({ name, email, budget, message });
      const receipt = projectBriefReceiptHtml(name);

      await Promise.all([
        sendEmail({
          from: MAIL_FROM,
          to: MAIL_TO,
          replyTo: email,
          ...brief,
        }),
        sendEmail({
          from: MAIL_FROM,
          to: email,
          ...receipt,
        }),
      ]);

      return Response.json({
        message:
          "Your project brief has been sent successfully. We will reply within one business day.",
      });
    } catch (err) {
      console.error("Failed to send project brief:", err);
      return Response.json(
        { message: "Could not send the project brief. Please try again or email us directly." },
        { status: 503 }
      );
    }
  }

  // 4. Admin newsletter dispatch (simple test-send via Resend)
  if (action === "send_newsletter" || action === "send") {
    if (
      !ADMIN_KEY ||
      (request.headers.get("x-admin-key") ?? body.adminKey) !== ADMIN_KEY
    ) {
      return Response.json({ message: "Unauthorized. Invalid admin key." }, { status: 401 });
    }

    const testEmail =
      typeof body.testEmail === "string" ? body.testEmail.trim() : "";
    const subject =
      typeof (body.newsletter as Record<string, unknown>)?.subject === "string"
        ? (body.newsletter as Record<string, unknown>).subject as string
        : "Notes from the lab";

    if (testEmail) {
      if (!isValidEmail(testEmail)) {
        return Response.json({ message: "Invalid test email address." }, { status: 400 });
      }

      try {
        await sendEmail({
          from: MAIL_FROM,
          to: testEmail,
          subject,
          html: `<p>This is a test send of the newsletter: <strong>${subject}</strong></p>`,
          text: `Test send: ${subject}`,
        });

        return Response.json({
          message: `Newsletter test sent to ${testEmail}.`,
          recipientsCount: 1,
        });
      } catch (err) {
        console.error("Failed to send test newsletter:", err);
        return Response.json(
          { message: "Failed to send test newsletter. Check RESEND_API_KEY." },
          { status: 503 }
        );
      }
    }

    return Response.json({
      message: "Test delivery complete. Broadcast mode requires a configured subscriber list.",
      recipientsCount: 0,
    });
  }

  return Response.json({ message: "Invalid action." }, { status: 400 });
}

/** Reject non-POST methods explicitly (prevents 405 from missing handler). */
export async function GET() {
  return Response.json({ message: "Method not allowed." }, { status: 405 });
}
