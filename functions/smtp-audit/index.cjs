const { randomUUID } = require("node:crypto");
const { smtpAuditEmail } = require("../mail/transactional.cjs");
const { deleteApp, getApps, initializeApp } = require("firebase-admin/app");
const { getDatabaseWithUrl } = require("firebase-admin/database");

const auditPath = "smtpAudit";
const auditAppName = "smtp-audit";
const defaultAuditRecipient = "dhinesh4668@outlook.com";

function auditDatabase() {
  const url = process.env.FIREBASE_DATABASE_URL
    || getApps().find((app) => app.name === "[DEFAULT]")?.options.databaseURL;
  if (!url) return;
  const app = getApps().find((candidate) => candidate.name === auditAppName)
    ?? initializeApp({ databaseURL: url }, auditAppName);
  return getDatabaseWithUrl(url, app);
}

function smtpFailure(error) {
  const code = error?.responseCode;
  return {
    status: "failed",
    ...(Number.isInteger(code) ? { responseCode: code } : {}),
  };
}

function smtpOutcome(info) {
  const acceptedCount = info.accepted?.length ?? 0;
  const rejectedCount = info.rejected?.length ?? 0;
  const status = acceptedCount === 0 ? "failed" : rejectedCount > 0 ? "partial" : "accepted";
  return { status, acceptedCount, rejectedCount };
}

async function notifyAudit(transport, ref, record, sender, recipient = defaultAuditRecipient) {
  const notification = ref.child("notification");
  const claim = await notification.transaction((current) => current === null
    ? { status: "sending", startedAt: Date.now() }
    : undefined);
  if (!claim.committed) return;

  let outcome;
  try {
    const info = await transport.sendMail({
      from: sender,
      to: recipient,
      ...smtpAuditEmail(ref.key, record),
    });
    outcome = smtpOutcome(info);
  } catch (error) {
    outcome = smtpFailure(error);
  }
  // Update the existing record so the notification does not trigger another email.
  await notification.update({ ...outcome, finishedAt: Date.now() });
}

async function writeAudit(transport, sender, record) {
  const id = randomUUID();
  let timeout;
  try {
    const database = auditDatabase();
    if (!database) {
      console.warn("SMTP audit unavailable: FIREBASE_DATABASE_URL is unset.", { id, ...record });
      return;
    }
    const ref = database.ref(auditPath).child(id);
    await Promise.race([
      ref.set(record),
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Audit write timed out")), 5000);
      }),
    ]);
    if (record.notifyVia === "inline") {
      await notifyAudit(transport, ref, record, sender, process.env.SMTP_AUDIT_TO || undefined);
    }
  } catch {
    // An audit or notification error must not cause the original SMTP send to be retried.
    console.error("SMTP audit or notification could not be confirmed.", { id, ...record });
  } finally {
    clearTimeout(timeout);
  }
}

async function sendAuditedMail(transport, source, action, message) {
  const startedAt = Date.now();
  const notifyVia = source === "firebase_function" ? "firebase" : "inline";
  const record = { source, action, startedAt, notifyVia };
  let info;
  try {
    info = await transport.sendMail(message);
  } catch (error) {
    await writeAudit(transport, message.from, { ...record, ...smtpFailure(error), finishedAt: Date.now() });
    throw error;
  }
  await writeAudit(transport, message.from, { ...record, ...smtpOutcome(info), finishedAt: Date.now() });
  return info;
}

async function closeSmtpAudit() {
  const app = getApps().find((candidate) => candidate.name === auditAppName);
  if (app) await deleteApp(app);
}

module.exports = { auditPath, closeSmtpAudit, notifyAudit, sendAuditedMail };
