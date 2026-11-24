import type { SmtpAuditRecord } from "../smtp-audit/index.cjs";

type RenderedEmail = { subject: string; html: string; text: string };

export function subscriptionConfirmation(origin: string, token: string): RenderedEmail;
export function projectBrief(details: { name: string; email: string; budget: string; message: string }): RenderedEmail;
export function projectBriefReceipt(name: string, origin?: string): RenderedEmail;
export function smtpAuditEmail(id: string, record: SmtpAuditRecord): RenderedEmail;
