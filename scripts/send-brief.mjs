#!/usr/bin/env node

/**
 * CLI script to dispatch a project brief enquiry via SMTP / API.
 *
 * Usage:
 *   node scripts/send-brief.mjs --name "Dhinesh" --email "dhinesh4668@outlook.com" --budget "50k-2l" --message "Need an enterprise mobile application."
 */

import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { projectBrief, projectBriefReceipt } from "../functions/mail/transactional.cjs";
import { closeSmtpAudit, sendAuditedMail } from "../functions/smtp-audit/index.cjs";

function loadEnv() {
  const possibleEnvFiles = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), "functions/.secret.local"),
  ];

  for (const envPath of possibleEnvFiles) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch {
        // Continue
      }
    }
  }
}

loadEnv();

const args = process.argv.slice(2);
function getArg(flag, defaultValue = "") {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const name = getArg("--name", "Dhinesh Kumar");
const email = getArg("--email", "dhinesh4668@outlook.com");
const budget = getArg("--budget", "₹50,000 – ₹2,00,000");
const message = getArg(
  "--message",
  "We are planning a custom mobile app with real-time sync and an admin dashboard. Looking forward to discussing scope and timelines."
);

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
const smtpSecure =
  process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : smtpPort === 465;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM || smtpUser;
const mailTo = process.env.MAIL_TO || "dhinesh4668@gmail.com";

if (!smtpUser || !smtpPass) {
  console.error("Error: SMTP_USER and SMTP_PASS must be configured in .env.");
  process.exit(1);
}

console.log("=== Dhidroid Labs — Project Brief Dispatcher ===");
console.log(`Connecting directly to SMTP server (${smtpHost}:${smtpPort}) as ${mailFrom}...`);
console.log(`Delivering studio notification to: ${mailTo}`);
console.log(`Delivering client confirmation to: ${email}`);

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: { user: smtpUser, pass: smtpPass },
});

try {
  // Send studio email
  const infoStudio = await sendAuditedMail(transporter, "brief_cli", "project_brief", {
    from: mailFrom,
    to: mailTo,
    replyTo: email,
    ...projectBrief({ name, email, budget, message }),
  });
  console.log(`✓ Studio notification delivered to ${mailTo} (ID: ${infoStudio.messageId})`);

  // Send client confirmation
  const infoClient = await sendAuditedMail(transporter, "brief_cli", "project_brief_receipt", {
    from: mailFrom,
    to: email,
    ...projectBriefReceipt(name, process.env.SITE_ORIGIN),
  });
  console.log(`✓ Client confirmation delivered to ${email} (ID: ${infoClient.messageId})`);

  console.log("\nSuccess: Project brief completely sent via your configured SMTP!");
} catch (err) {
  console.error("Failed to send project brief via SMTP:", err.message);
  process.exitCode = 1;
} finally {
  await closeSmtpAudit();
}
