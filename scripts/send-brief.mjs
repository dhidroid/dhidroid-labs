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

// 1. Studio notification
const studioHtml = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:28px;background:#fbfbf8;border-radius:12px;border:1px solid #e4e3de;color:#262323;">
    <h2 style="font-family:'Instrument Serif',Georgia,serif;font-size:28px;margin-top:0;color:#262323;">New Project Brief Received</h2>
    <p style="font-size:14px;color:#7a7674;">Submitted via Dhidroid Labs project enquiry system.</p>
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

// 2. Client receipt confirmation
const clientHtml = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#fbfbf8;border-radius:12px;border:1px solid #e4e3de;color:#262323;">
    <h2 style="font-family:'Instrument Serif',Georgia,serif;font-size:26px;margin-top:0;color:#262323;">Thank you for your project brief</h2>
    <p style="font-size:15px;line-height:1.6;color:#4a4645;">Hi ${name},</p>
    <p style="font-size:15px;line-height:1.6;color:#4a4645;">We received your enquiry and project details. We will review them and get back to you within one business day.</p>
    <p style="font-size:15px;line-height:1.6;color:#4a4645;">If you'd like to talk directly in the meantime, you can also book a free 30-minute discovery call at <a href="https://dhidroid-labs.dhidroid.workers.dev/contact" style="color:#3b4bdf;">dhidroid-labs.dhidroid.workers.dev/contact</a>.</p>
    <p style="font-size:14px;color:#7a7674;margin-top:24px;">— Dhidroid Labs Team<br>Chennai, India</p>
  </div>
`;

const clientText = `Hi ${name},\n\nThank you for reaching out to Dhidroid Labs. We received your project brief and will get back to you within one business day.\n\n— Dhidroid Labs Team`;

try {
  // Send studio email
  const infoStudio = await transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    replyTo: email,
    subject: `New Project Brief: ${name}`,
    html: studioHtml,
    text: studioText,
  });
  console.log(`✓ Studio notification delivered to ${mailTo} (ID: ${infoStudio.messageId})`);

  // Send client confirmation
  const infoClient = await transporter.sendMail({
    from: mailFrom,
    to: email,
    subject: "We received your project brief — Dhidroid Labs",
    html: clientHtml,
    text: clientText,
  });
  console.log(`✓ Client confirmation delivered to ${email} (ID: ${infoClient.messageId})`);

  console.log("\nSuccess: Project brief completely sent via your configured SMTP!");
} catch (err) {
  console.error("Failed to send project brief via SMTP:", err.message);
  process.exit(1);
}
