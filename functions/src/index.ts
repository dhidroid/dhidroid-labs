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
import { onValueCreated } from "firebase-functions/v2/database";
import nodemailer from "nodemailer";
import { projectBrief, projectBriefReceipt, subscriptionConfirmation } from "../mail/transactional.cjs";
import { auditPath, notifyAudit, sendAuditedMail, type SmtpAuditRecord } from "../smtp-audit/index.cjs";
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
const SMTP_AUDIT_TO = defineString("SMTP_AUDIT_TO", { default: "dhinesh4668@outlook.com" });
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

function createSmtpTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST.value(),
    port: SMTP_PORT.value(),
    secure: SMTP_SECURE.value(),
    auth: { user: SMTP_USER.value(), pass: SMTP_PASS.value() },
  });
}

export const notifySmtpAudit = onValueCreated(
  { ref: `/${auditPath}/{auditId}`, region: "us-central1", secrets: [SMTP_PASS], timeoutSeconds: 60 },
  async (event) => {
    const record = event.data.val() as SmtpAuditRecord;
    if (record.notifyVia === "firebase") {
      await notifyAudit(createSmtpTransport(), event.data.ref, record, MAIL_FROM.value(), SMTP_AUDIT_TO.value());
    }
  },
);

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

      const transport = createSmtpTransport();

      const recipient = MAIL_TO.value() || "dhinesh4668@gmail.com";

      try {
        await sendAuditedMail(transport, "firebase_function", "project_brief", {
          from: MAIL_FROM.value(),
          to: recipient,
          replyTo: email,
          ...projectBrief({ name, email, budget, message }),
        });

        await sendAuditedMail(transport, "firebase_function", "project_brief_receipt", {
          from: MAIL_FROM.value(),
          to: email,
          ...projectBriefReceipt(name, SITE_ORIGIN.value()),
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

      if (!configuredAdminKey || providedKey !== configuredAdminKey) {
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

      const transport = createSmtpTransport();

      // A) Send to specific test email address
      if (testEmail) {
        if (!isValidEmail(testEmail)) {
          response.status(400).json({ message: "Invalid test email address." });
          return;
        }

        const html = renderNewsletterHtml(newsletterData);
        const text = renderNewsletterText(newsletterData);

        try {
          await sendAuditedMail(transport, "firebase_function", "newsletter_test", {
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

            await sendAuditedMail(transport, "firebase_function", "newsletter_broadcast", {
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
        const transport = createSmtpTransport();
        await sendAuditedMail(transport, "firebase_function", "subscription_confirmation", {
          from: MAIL_FROM.value(),
          to: email,
          ...subscriptionConfirmation(SITE_ORIGIN.value(), token),
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
