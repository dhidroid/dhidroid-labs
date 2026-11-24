const defaultSite = "https://dhidroid-labs.dhidroid.workers.dev";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeLink(path, origin = defaultSite) {
  try {
    const url = new URL(path, origin);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    // Use the public site when a caller supplies an invalid origin.
  }
  return new URL(path, defaultSite).href;
}

function renderEmail({ subject, title, label, paragraphs, fields = [], detail, action, note }) {
  const fieldRows = fields.map(([name, value]) => `
    <tr><td class="rule" style="padding:10px 0;border-top:1px solid #e4e3de;">
      <strong class="ink" style="color:#262323;">${escapeHtml(name)}</strong><br>
      <span class="ink" style="color:#4a4645;overflow-wrap:anywhere;">${escapeHtml(value)}</span>
    </td></tr>`).join("");
  const detailCard = detail ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="tint" style="margin-top:16px;background:#eef0ff;border-radius:12px;">
      <tr><td style="padding:20px;overflow-wrap:anywhere;">
        <strong class="ink" style="color:#262323;">${escapeHtml(detail.label)}</strong>
        <p class="ink" style="margin:8px 0 0;color:#4a4645;">${escapeHtml(detail.text).replace(/\r\n?|\n/g, "<br>")}</p>
      </td></tr>
    </table>` : "";
  const button = action ? `
    <table role="presentation" cellpadding="0" cellspacing="0" class="btn" style="margin-top:24px;">
      <tr><td style="background:#262323;border-radius:8px;">
        <a href="${escapeHtml(action.url)}" style="display:inline-block;padding:13px 20px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;border-radius:8px;">${escapeHtml(action.label)}</a>
      </td></tr>
    </table>` : "";

  // The newsletter's wordmark, table layout, colors, fonts and dark-mode styles.
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Instrument+Serif:ital@0;1&amp;display=swap" rel="stylesheet">
<style>
@media(max-width:620px){.wrap{width:100%!important}.pad{padding-left:20px!important;padding-right:20px!important}.h1{font-size:34px!important}}
@media(prefers-color-scheme:dark){body,.bg{background:#161515!important}.card{background:#211f1f!important}.ink{color:#f1efe9!important}.mute{color:#a9a59d!important}.rule{border-color:#33302f!important}.tint{background:#1b2040!important}.btn a{background:#9db0ff!important;color:#161515!important}}
</style>
</head>
<body style="margin:0;padding:0;background:#f5f5f2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(paragraphs[0])}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="bg" style="background:#f5f5f2;font-family:Inter,Arial,Helvetica,sans-serif;">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" class="wrap" style="width:600px;max-width:100%;">
<tr><td class="pad" style="padding:0 32px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td class="ink" style="font-family:'Instrument Serif',Georgia,serif;font-size:26px;color:#262323;">Dhidroid <i>Labs</i></td>
<td align="right" class="mute" style="font-size:13px;color:#7a7674;">${escapeHtml(label)}</td>
</tr></table></td></tr>
<tr><td class="card pad" style="padding:36px 32px;background:#fbfbf8;border-radius:16px;font-size:16px;line-height:1.6;">
<h1 class="h1 ink" style="margin:0 0 18px;color:#262323;font-size:44px;line-height:1.1;font-weight:400;letter-spacing:-1px;">${escapeHtml(title)}</h1>
${paragraphs.map((paragraph) => `<p class="ink" style="margin:0 0 12px;color:#4a4645;">${escapeHtml(paragraph)}</p>`).join("")}
${fieldRows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;font-size:14px;">${fieldRows}</table>` : ""}
${detailCard}${button}
${note ? `<p class="mute" style="margin:20px 0 0;font-size:13px;color:#7a7674;">${escapeHtml(note)}</p>` : ""}
</td></tr>
<tr><td align="center" class="mute pad" style="padding:24px 32px 0;font-size:12px;color:#7a7674;">Dhidroid Labs · Chennai, India</td></tr>
</table></td></tr></table>
</body></html>`;
  const text = [
    [title],
    paragraphs,
    fields.map(([name, value]) => `${name}: ${value}`),
    detail ? [`${detail.label}\n${detail.text}`] : [],
    action ? [`${action.label}: ${action.url}`] : [],
    note ? [note] : [],
    ["Dhidroid Labs · Chennai, India"],
  ].filter((section) => section.length).map((section) => section.join("\n")).join("\n\n");

  return { subject, html, text };
}

function subscriptionConfirmation(origin, token) {
  const link = new URL(safeLink("/newsletter", origin));
  link.searchParams.set("confirm", token);
  return renderEmail({
    subject: "Confirm your Dhidroid Labs newsletter subscription",
    title: "Confirm your subscription",
    label: "Notes from the lab",
    paragraphs: ["Confirm your email address to receive Notes from the lab."],
    action: { label: "Confirm subscription", url: link.href },
    note: "This link expires in 24 hours. If you didn’t request this newsletter, you can ignore this email.",
  });
}

function projectBrief({ name, email, budget, message }) {
  return renderEmail({
    subject: `New Project Brief: ${name.replace(/[\r\n]+/g, " ")}`,
    title: "New project brief",
    label: "Project enquiries",
    paragraphs: ["A project enquiry was submitted to Dhidroid Labs. Reply to this email to follow up with the sender."],
    fields: [["Name", name], ["Email", email], ["Budget", budget]],
    detail: { label: "Project description", text: message },
  });
}

function projectBriefReceipt(name, origin) {
  return renderEmail({
    subject: "We received your project brief — Dhidroid Labs",
    title: "We received your project brief",
    label: "Project enquiries",
    paragraphs: [`Hi ${name},`, "Thanks for sharing your project with us. We’ll review your brief and get back to you within one business day."],
    action: { label: "Visit the contact page", url: safeLink("/contact", origin) },
  });
}

function smtpAuditEmail(id, record) {
  return renderEmail({
    subject: `[Dhidroid Labs SMTP] ${record.action} · ${record.status}`,
    title: "SMTP activity record",
    label: "Mail audit",
    paragraphs: ["An email send attempt was recorded in Firebase Realtime Database."],
    fields: [
      ["Audit ID", id],
      ["Action", record.action],
      ["Source", record.source],
      ["SMTP status", record.status],
      ["Started (UTC)", new Date(record.startedAt).toISOString()],
      ["Finished (UTC)", new Date(record.finishedAt).toISOString()],
      ["Accepted recipients", record.acceptedCount ?? "unknown"],
      ["Rejected recipients", record.rejectedCount ?? "unknown"],
      ...(record.responseCode ? [["SMTP response code", record.responseCode]] : []),
    ],
  });
}

module.exports = { subscriptionConfirmation, projectBrief, projectBriefReceipt, smtpAuditEmail };
