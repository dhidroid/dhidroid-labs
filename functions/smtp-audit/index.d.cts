import type { Reference } from "firebase-admin/database";
import type { SendMailOptions, SentMessageInfo, Transporter } from "nodemailer";

export const auditPath: "smtpAudit";
export type SmtpAuditStatus = "accepted" | "partial" | "failed";
export type SmtpOutcome = {
  status: SmtpAuditStatus;
  acceptedCount?: number;
  rejectedCount?: number;
  responseCode?: number;
};
export type SmtpAuditRecord = SmtpOutcome & {
  source: "firebase_function" | "next_api" | "newsletter_cli" | "brief_cli";
  action: "subscription_confirmation" | "project_brief" | "project_brief_receipt" | "newsletter_test" | "newsletter_broadcast";
  notifyVia: "inline" | "firebase";
  startedAt: number;
  finishedAt: number;
};
export function sendAuditedMail(
  transport: Transporter,
  source: SmtpAuditRecord["source"],
  action: SmtpAuditRecord["action"],
  message: SendMailOptions,
): Promise<SentMessageInfo>;
export function notifyAudit(
  transport: Transporter,
  ref: Reference,
  record: SmtpAuditRecord,
  sender: SendMailOptions["from"],
  recipient?: string,
): Promise<void>;
export function closeSmtpAudit(): Promise<void>;
