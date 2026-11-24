#!/usr/bin/env node

/**
 * CLI script to dispatch custom newsletters via:
 * 1. The HTTP newsletter API endpoint (if NEXT_PUBLIC_NEWSLETTER_API_URL is active)
 * 2. Or direct SMTP transport using credentials configured in .env (as fallback or direct test)
 *
 * Usage:
 *   node scripts/send-newsletter.mjs --test you@domain.com
 *   node scripts/send-newsletter.mjs --broadcast
 */

import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { closeSmtpAudit, sendAuditedMail } from "../functions/smtp-audit/index.cjs";

// Load environment variables from .env if present
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

const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_API_URL;
const adminKey = process.env.ADMIN_KEY || "";
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
const smtpSecure =
  process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : smtpPort === 465;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM || smtpUser;

// Parse command line arguments
const args = process.argv.slice(2);
const isBroadcast = args.includes("--broadcast");
const testArgIndex = args.indexOf("--test");
const testEmail = testArgIndex !== -1 ? args[testArgIndex + 1] : null;

if (!isBroadcast && !testEmail) {
  console.log(`
Dhidroid Labs — Custom Newsletter Sender

Usage:
  node scripts/send-newsletter.mjs --test <email>      Send test newsletter
  node scripts/send-newsletter.mjs --broadcast         Broadcast to all confirmed subscribers

Environment:
  NEXT_PUBLIC_NEWSLETTER_API_URL: ${endpoint || "(not set)"}
  SMTP_HOST:                      ${smtpHost}
  SMTP_USER:                      ${smtpUser ? "(configured)" : "(not configured)"}
  MAIL_FROM:                      ${mailFrom || "(not configured)"}
`);
  process.exit(0);
}

// Read and render the template from public/newsletter-template.html
const templatePath = path.resolve(process.cwd(), "public/newsletter-template.html");
if (!fs.existsSync(templatePath)) {
  console.error(`Error: Newsletter template not found at ${templatePath}`);
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, "utf-8");

const newsletterData = {
  subject: "Notes from the lab · Issue 01",
  preheader: "Practical engineering notes and experiments from Dhidroid Labs.",
  issue_number: "01",
  issue_date: "November 2026",
  headline: "Engineering ideas into useful products.",
  first_name: "Friend",
  article_title: "React Modernization: Where to Begin Without a Full Rewrite",
  article_excerpt:
    "Practical steps to incrementally improve legacy React codebases without grinding feature development to a halt.",
  article_url: "https://dhidroid-labs.dhidroid.workers.dev/blog/react-modernization-checklist",
  lab_item_1_title: "Cross-platform gesture handling",
  lab_item_1_text: "Comparing reanimated vs native gesture handlers in complex scroll views.",
  lab_item_2_title: "Offline sync engines",
  lab_item_2_text: "Conflict resolution strategies when syncing SQLite data with Cloud Firestore.",
  lab_item_3_title: "Low-latency API proxies",
  lab_item_3_text: "Edge function routing patterns that cut p95 response times by 40%.",
  tip_text:
    "When designing mobile state, keep network-bound state separate from device cache to avoid unexpected UI blinks.",
  site_url: "https://dhidroid-labs.dhidroid.workers.dev",
  unsubscribe_url: "https://dhidroid-labs.dhidroid.workers.dev/newsletter",
  preferences_url: "https://dhidroid-labs.dhidroid.workers.dev/newsletter",
  postal_address: "Chennai, India",
};

function renderHtml(data) {
  const map = { ...newsletterData, ...data };
  return templateHtml.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
    return Object.prototype.hasOwnProperty.call(map, key) ? String(map[key]) : `{{${key}}}`;
  });
}

function renderText(data) {
  const map = { ...newsletterData, ...data };
  return `Dhidroid Labs
Issue ${map.issue_number} · ${map.issue_date}

Notes from the lab: ${map.headline}

Hi ${map.first_name || "Friend"}, here is this issue’s short read on building useful software, plus what we have been trying in the lab.

FEATURED ARTICLE:
${map.article_title}
${map.article_excerpt}
Read more: ${map.article_url}

FROM THE LAB:
* ${map.lab_item_1_title}: ${map.lab_item_1_text}
* ${map.lab_item_2_title}: ${map.lab_item_2_text}
* ${map.lab_item_3_title}: ${map.lab_item_3_text}

ONE USEFUL IDEA:
${map.tip_text}

Start a conversation: ${map.site_url}/contact
Unsubscribe: ${map.unsubscribe_url}
Dhidroid Labs · Chennai, India · ${map.postal_address}
`;
}

async function sendDirectSmtp(recipientEmail) {
  if (!smtpUser || !smtpPass) {
    throw new Error(
      "Direct SMTP sending requires SMTP_USER and SMTP_PASS configured in .env."
    );
  }

  console.log(`Connecting directly via SMTP (${smtpHost}:${smtpPort}) as ${mailFrom}...`);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const html = renderHtml({ first_name: "Friend" });
  const text = renderText({ first_name: "Friend" });

  const info = await sendAuditedMail(transporter, "newsletter_cli", "newsletter_test", {
    from: mailFrom,
    to: recipientEmail,
    subject: newsletterData.subject,
    html,
    text,
  });

  return info;
}

async function main() {
  console.log(`=== Dhidroid Labs Custom Newsletter Dispatcher ===`);
  console.log(`Template: public/newsletter-template.html`);
  console.log(`Mode:     ${isBroadcast ? "Broadcast to all subscribers" : `Test to ${testEmail}`}`);

  // 1. Try HTTP API endpoint if configured
  if (endpoint) {
    console.log(`Attempting delivery via API endpoint: ${endpoint}`);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminKey ? { "X-Admin-Key": adminKey } : {}),
        },
        body: JSON.stringify({
          action: "send_newsletter",
          adminKey,
          testEmail: isBroadcast ? undefined : testEmail,
          newsletter: newsletterData,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(`✓ API Success: ${result.message}`);
        return;
      }
      console.warn(`API responded with ${response.status}: ${result.message || "Failed"}`);
    } catch (apiErr) {
      console.warn(`API endpoint not reachable (${apiErr.message}).`);
    }
  } else {
    console.log(`NEXT_PUBLIC_NEWSLETTER_API_URL is not set.`);
  }

  // 2. Direct SMTP Fallback (for testing or direct dispatch)
  if (!isBroadcast && testEmail) {
    console.log(`Falling back to direct SMTP transport...`);
    try {
      const info = await sendDirectSmtp(testEmail);
      console.log(`✓ Custom newsletter successfully delivered to ${testEmail}!`);
      if (info.messageId) {
        console.log(`  Message ID: ${info.messageId}`);
      }
      return;
    } catch (smtpErr) {
      console.error(`Direct SMTP delivery failed: ${smtpErr.message}`);
      process.exitCode = 1;
    }
  }

  if (isBroadcast) {
    console.error(
      `Broadcast delivery requires either the Firebase Functions endpoint (NEXT_PUBLIC_NEWSLETTER_API_URL) to query subscribers, or local Firestore connection.`
    );
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exitCode = 1;
}).finally(closeSmtpAudit);
