import { createHash, randomBytes } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import {
  FieldValue,
  Timestamp,
  getFirestore,
} from "firebase-admin/firestore";
import {
  defineBoolean,
  defineInt,
  defineSecret,
  defineString,
} from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";
import nodemailer from "nodemailer";
import {
  NewsletterData,
  renderNewsletterHtml,
  renderNewsletterText,
} from "./template";

initializeApp();

const db = getFirestore();
const SITE_ORIGIN = defineString("SITE_ORIGIN", {
  default: "https://dhidroid-labs.dhidroid.workers.dev",
});
const SMTP_HOST = defineString("SMTP_HOST", { default: "smtp.gmail.com" });
const SMTP_PORT = defineInt("SMTP_PORT", { default: 465 });
const SMTP_SECURE = defineBoolean("SMTP_SECURE", { default: true });
const SMTP_USER = defineString("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");
const ADMIN_KEY = defineString("ADMIN_KEY", { default: "" });
const MAIL_FROM = defineString("MAIL_FROM");
const MAIL_TO = defineString("MAIL_TO", { default: "dhinesh4668@gmail.com" });
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

const subscriberCollection = db.collection("newsletterSubscribers");
const tokenCollection = db.collection("newsletterConfirmationTokens");
const campaignCollection = db.collection("newsletterCampaigns");
const briefCollection = db.collection("projectBriefs");

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true;
    if (url.hostname === "dhidroid-labs.dhidroid.workers.dev") return true;
    if (
      url.hostname.endsWith(".workers.dev") ||
      url.hostname.endsWith(".web.app") ||
      url.hostname.endsWith(".firebaseapp.com")
    ) {
      return true;
    }
    const configuredOrigin = new URL(SITE_ORIGIN.value());
    return url.origin === configuredOrigin.origin;
  } catch {
    return false;
  }
}

function getAllowedOrigin(requestOrigin?: string): string {
  if (requestOrigin && isAllowedOrigin(requestOrigin)) {
    return requestOrigin;
  }
  try {
    const configured = new URL(SITE_ORIGIN.value());
    return configured.origin;
  } catch {
    return "https://dhidroid-labs.dhidroid.workers.dev";
  }
}

function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
}

function createConfirmationEmail(siteOrigin: string, token: string) {
  const confirmationUrl = new URL("/newsletter", siteOrigin);
  confirmationUrl.searchParams.set("confirm", token);
  const url = confirmationUrl.toString();

  return {
    subject: "Confirm your Dhidroid Labs newsletter subscription",
    text: `Confirm your subscription to the Dhidroid Labs newsletter:\n\n${url}\n\nThis link expires in 24 hours. If you did not request this, you can ignore this email.`,
    html: `<p>Confirm your subscription to the Dhidroid Labs newsletter:</p><p><a href="${url}">Confirm subscription</a></p><p>This link expires in 24 hours. If you did not request this, you can ignore this email.</p>`,
  };
}

export const newsletterSignup = onRequest(
  { secrets: [SMTP_PASS], timeoutSeconds: 60 },
  async (request, response) => {
    const requestOrigin = request.get("origin");
    if (requestOrigin && !isAllowedOrigin(requestOrigin)) {
      response.status(403).json({ message: "Origin is not allowed." });
      return;
    }
    const allowedOrigin = getAllowedOrigin(requestOrigin);

    response.set("Access-Control-Allow-Origin", allowedOrigin);
    response.set("Vary", "Origin");
    response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type, X-Admin-Key");

    if (request.method === "OPTIONS") {
      response.status(204).end();
      return;
    }
    if (request.method !== "POST") {
      response.set("Allow", "POST, OPTIONS");
      response.status(405).json({ message: "Method not allowed." });
      return;
    }

    const action = request.body?.action;

    // 1. Confirm newsletter subscription token
    if (action === "confirm") {
      const token = request.body?.token;
      if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
        response.status(400).json({ message: "Confirmation link is invalid or expired." });
        return;
      }

      const tokenHash = hash(token);
      const tokenRef = tokenCollection.doc(tokenHash);
      const confirmed = await db.runTransaction(async (transaction) => {
        const tokenSnapshot = await transaction.get(tokenRef);
        if (!tokenSnapshot.exists) return false;

        const emailHash = tokenSnapshot.get("emailHash");
        const expiresAt = tokenSnapshot.get("expiresAt") as Timestamp | undefined;
        if (typeof emailHash !== "string" || !expiresAt) return false;

        const subscriberRef = subscriberCollection.doc(emailHash);
        const subscriberSnapshot = await transaction.get(subscriberRef);
        if (!subscriberSnapshot.exists) return false;

        const subscriber = subscriberSnapshot.data();
        if (!subscriber) return false;
        if (
          subscriber.status !== "pending_confirmation" ||
          subscriber.confirmationTokenHash !== tokenHash ||
          expiresAt.toMillis() <= Date.now()
        ) {
          return false;
        }

        transaction.update(subscriberRef, {
          status: "confirmed",
          confirmedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          confirmationTokenHash: FieldValue.delete(),
        });
        transaction.delete(tokenRef);
        return true;
      });

      if (!confirmed) {
        response.status(400).json({ message: "Confirmation link is invalid or expired." });
        return;
      }

      response.status(200).json({ message: "Your newsletter subscription is confirmed. Thank you!" });
      return;
    }

    // 2. Project Brief / Contact Form submission via SMTP
    if (action === "project_brief" || action === "contact") {
      const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
      const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
      const budget = typeof request.body?.budget === "string" ? request.body.budget.trim() : "Prefer not to say";
      const message = typeof request.body?.message === "string" ? request.body.message.trim() : "";

      if (!name || !isValidEmail(email) || !message) {
        response.status(400).json({
          message: "Please provide a valid name, email address, and project description.",
        });
        return;
      }

      const transport = nodemailer.createTransport({
        host: SMTP_HOST.value(),
        port: SMTP_PORT.value(),
        secure: SMTP_SECURE.value(),
        auth: { user: SMTP_USER.value(), pass: SMTP_PASS.value() },
      });

      const recipient = MAIL_TO.value() || "dhinesh4668@gmail.com";

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

      const studioText = `New Project Brief from ${name} (${email})\nBudget: ${budget}\n\nProject Description:\n${message}\n`;

      try {
        await transport.sendMail({
          from: MAIL_FROM.value(),
          to: recipient,
          replyTo: email,
          subject: `New Project Brief: ${name}`,
          html: studioHtml,
          text: studioText,
        });

        // Client receipt acknowledgement
        const clientHtml = `
          <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#fbfbf8;border-radius:12px;border:1px solid #e4e3de;color:#262323;">
            <h2 style="font-family:'Instrument Serif',Georgia,serif;font-size:26px;margin-top:0;color:#262323;">Thank you for your project brief</h2>
            <p style="font-size:15px;line-height:1.6;color:#4a4645;">Hi ${name},</p>
            <p style="font-size:15px;line-height:1.6;color:#4a4645;">We received your enquiry and project details. We will review them and get back to you within one business day.</p>
            <p style="font-size:15px;line-height:1.6;color:#4a4645;">If you'd like to talk directly in the meantime, you can also book a free 30-minute discovery call at <a href="${allowedOrigin}/contact" style="color:#3b4bdf;">dhidroid-labs.com/contact</a>.</p>
            <p style="font-size:14px;color:#7a7674;margin-top:24px;">— Dhidroid Labs Team<br>Chennai, India</p>
          </div>
        `;
        const clientText = `Hi ${name},\n\nThank you for reaching out to Dhidroid Labs. We received your project brief and will get back to you within one business day.\n\n— Dhidroid Labs Team`;

        await transport.sendMail({
          from: MAIL_FROM.value(),
          to: email,
          subject: "We received your project brief — Dhidroid Labs",
          html: clientHtml,
          text: clientText,
        });

        await briefCollection.add({
          name,
          email,
          budget,
          message,
          status: "received",
          createdAt: FieldValue.serverTimestamp(),
        });

        response.status(200).json({
          message: "Your project brief has been sent successfully. We will reply within one business day.",
        });
        return;
      } catch (err) {
        console.error("Failed to send project brief via SMTP:", err);
        response.status(503).json({
          message: "Could not send project brief. Please try again later.",
        });
        return;
      }
    }

    // 3. Send custom newsletter
    if (action === "send_newsletter" || action === "send") {
      const configuredAdminKey = ADMIN_KEY.value() || process.env.ADMIN_KEY || "";
      const providedKey = request.body?.adminKey || request.get("x-admin-key");

      if (configuredAdminKey && providedKey !== configuredAdminKey) {
        response.status(401).json({ message: "Unauthorized. Invalid admin key." });
        return;
      }

      const rawNewsletter = (request.body?.newsletter || {}) as Partial<NewsletterData>;
      const testEmail = request.body?.testEmail;

      const newsletterData: Partial<NewsletterData> = {
        ...rawNewsletter,
        site_url: rawNewsletter.site_url || allowedOrigin,
        unsubscribe_url: rawNewsletter.unsubscribe_url || `${allowedOrigin}/newsletter`,
        preferences_url: rawNewsletter.preferences_url || `${allowedOrigin}/newsletter`,
      };

      const transport = nodemailer.createTransport({
        host: SMTP_HOST.value(),
        port: SMTP_PORT.value(),
        secure: SMTP_SECURE.value(),
        auth: { user: SMTP_USER.value(), pass: SMTP_PASS.value() },
      });

      // A) Send to specific test email address
      if (testEmail) {
        if (!isValidEmail(testEmail)) {
          response.status(400).json({ message: "Invalid test email address." });
          return;
        }

        const html = renderNewsletterHtml(newsletterData);
        const text = renderNewsletterText(newsletterData);

        try {
          await transport.sendMail({
            from: MAIL_FROM.value(),
            to: testEmail,
            subject: newsletterData.subject || "Notes from the lab",
            html,
            text,
          });

          response.status(200).json({
            message: `Custom newsletter test successfully sent to ${testEmail}!`,
            recipientsCount: 1,
          });
          return;
        } catch (err) {
          console.error("Failed to send test newsletter:", err);
          response.status(503).json({
            message: "Failed to send test newsletter. Please verify SMTP settings.",
          });
          return;
        }
      }

      // B) Broadcast to all confirmed subscribers
      try {
        const snapshot = await subscriberCollection
          .where("status", "==", "confirmed")
          .get();

        if (snapshot.empty) {
          response.status(200).json({
            message: "No confirmed subscribers found to receive this newsletter.",
            recipientsCount: 0,
          });
          return;
        }

        const subscribers = snapshot.docs.map((doc) => doc.data() as { email: string; firstName?: string });
        let sentCount = 0;
        let failedCount = 0;

        for (const sub of subscribers) {
          try {
            const personalData: Partial<NewsletterData> = {
              ...newsletterData,
              first_name: sub.firstName || newsletterData.first_name || "Friend",
            };
            const html = renderNewsletterHtml(personalData);
            const text = renderNewsletterText(personalData);

            await transport.sendMail({
              from: MAIL_FROM.value(),
              to: sub.email,
              subject: newsletterData.subject || "Notes from the lab",
              html,
              text,
            });
            sentCount++;
          } catch (sendErr) {
            console.error(`Failed sending to ${sub.email}:`, sendErr);
            failedCount++;
          }
        }

        await campaignCollection.add({
          subject: newsletterData.subject,
          headline: newsletterData.headline,
          issueNumber: newsletterData.issue_number,
          issueDate: newsletterData.issue_date,
          totalRecipients: subscribers.length,
          sentCount,
          failedCount,
          sentAt: FieldValue.serverTimestamp(),
        });

        response.status(200).json({
          message: `Custom newsletter sent: ${sentCount} delivered, ${failedCount} failed out of ${subscribers.length} confirmed subscribers.`,
          sentCount,
          failedCount,
          recipientsCount: subscribers.length,
        });
        return;
      } catch (broadcastErr) {
        console.error("Failed broadcasting newsletter:", broadcastErr);
        response.status(500).json({
          message: "Internal error processing subscriber list.",
        });
        return;
      }
    }

    // 4. Subscribe new reader
    if (action !== "subscribe") {
      response.status(400).json({ message: "Invalid newsletter request." });
      return;
    }

    if (!isValidEmail(request.body?.email)) {
      response.status(400).json({ message: "Enter a valid email address." });
      return;
    }

    const email = request.body.email.trim().toLowerCase();
    const emailHash = hash(email);
    const subscriberRef = subscriberCollection.doc(emailHash);
    const token = randomBytes(32).toString("base64url");
    const tokenHash = hash(token);
    const tokenRef = tokenCollection.doc(tokenHash);
    const expiresAt = Timestamp.fromMillis(Date.now() + TOKEN_LIFETIME_MS);

    const shouldSendEmail = await db.runTransaction(async (transaction) => {
      const subscriberSnapshot = await transaction.get(subscriberRef);
      if (
        subscriberSnapshot.exists &&
        subscriberSnapshot.get("status") === "confirmed"
      ) {
        return false;
      }
      const confirmationExpiresAt = subscriberSnapshot.get(
        "confirmationExpiresAt"
      ) as Timestamp | undefined;
      if (
        subscriberSnapshot.exists &&
        subscriberSnapshot.get("emailStatus") === "sent" &&
        confirmationExpiresAt &&
        confirmationExpiresAt.toMillis() > Date.now()
      ) {
        return false;
      }

      const previousTokenHash = subscriberSnapshot.get("confirmationTokenHash");
      if (previousTokenHash) {
        transaction.delete(tokenCollection.doc(previousTokenHash));
      }

      transaction.set(
        subscriberRef,
        {
          email,
          status: "pending_confirmation",
          emailStatus: "pending",
          confirmationTokenHash: tokenHash,
          confirmationExpiresAt: expiresAt,
          updatedAt: FieldValue.serverTimestamp(),
          ...(subscriberSnapshot.exists
            ? {}
            : { createdAt: FieldValue.serverTimestamp() }),
        },
        { merge: true }
      );
      transaction.set(tokenRef, { emailHash, expiresAt });
      return true;
    });

    if (shouldSendEmail) {
      try {
        const emailContent = createConfirmationEmail(allowedOrigin, token);
        const transport = nodemailer.createTransport({
          host: SMTP_HOST.value(),
          port: SMTP_PORT.value(),
          secure: SMTP_SECURE.value(),
          auth: { user: SMTP_USER.value(), pass: SMTP_PASS.value() },
        });
        await transport.sendMail({
          from: MAIL_FROM.value(),
          to: email,
          ...emailContent,
        });
        await subscriberRef.update({
          emailStatus: "sent",
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch {
        await db.runTransaction(async (transaction) => {
          const subscriberSnapshot = await transaction.get(subscriberRef);
          if (subscriberSnapshot.get("confirmationTokenHash") === tokenHash) {
            transaction.update(subscriberRef, {
              emailStatus: "failed",
              updatedAt: FieldValue.serverTimestamp(),
            });
          }
        });
        console.error("Newsletter confirmation email could not be sent.");
        response.status(503).json({
          message: "We could not send the confirmation email. Please try again later.",
        });
        return;
      }
    }

    response.status(200).json({
      message: "Check your inbox for a link to confirm your subscription.",
    });
  }
);
