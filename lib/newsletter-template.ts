export interface NewsletterData {
  subject: string;
  preheader: string;
  issue_number: string | number;
  issue_date: string;
  headline: string;
  first_name?: string;
  article_title: string;
  article_excerpt: string;
  article_url: string;
  lab_item_1_title: string;
  lab_item_1_text: string;
  lab_item_2_title: string;
  lab_item_2_text: string;
  lab_item_3_title: string;
  lab_item_3_text: string;
  tip_text: string;
  site_url?: string;
  unsubscribe_url?: string;
  preferences_url?: string;
  postal_address?: string;
}

export const DEFAULT_NEWSLETTER_DATA: NewsletterData = {
  subject: "Notes from the lab · Issue 01",
  preheader: "Practical engineering notes and experiments from Dhidroid Labs.",
  issue_number: "01",
  issue_date: "November 2026",
  headline: "Engineering ideas into useful products.",
  first_name: "Friend",
  article_title: "React Modernization: Where to Begin Without a Full Rewrite",
  article_excerpt: "Practical steps to incrementally improve legacy React codebases without grinding feature development to a halt.",
  article_url: "https://dhidroid-labs.dhidroid.workers.dev/blog/react-modernization-checklist",
  lab_item_1_title: "Cross-platform gesture handling",
  lab_item_1_text: "Comparing reanimated vs native gesture handlers in complex scroll views.",
  lab_item_2_title: "Offline sync engines",
  lab_item_2_text: "Conflict resolution strategies when syncing SQLite data with Cloud Firestore.",
  lab_item_3_title: "Low-latency API proxies",
  lab_item_3_text: "Edge function routing patterns that cut p95 response times by 40%.",
  tip_text: "When designing mobile state, keep network-bound state separate from device cache to avoid unexpected UI blinks.",
  site_url: "https://dhidroid-labs.dhidroid.workers.dev",
  unsubscribe_url: "https://dhidroid-labs.dhidroid.workers.dev/newsletter",
  preferences_url: "https://dhidroid-labs.dhidroid.workers.dev/newsletter",
  postal_address: "Chennai, India",
};

export const NEWSLETTER_TEMPLATE_RAW = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>{{subject}}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
body{margin:0;padding:0;background:#f5f5f2}
a{color:#3b4bdf}
.serif{font-family:'Instrument Serif',Georgia,'Times New Roman',serif}
@media (max-width:620px){.wrap{width:100%!important}.pad{padding-left:20px!important;padding-right:20px!important}.h1{font-size:36px!important}}
@media (prefers-color-scheme:dark){body,.bg{background:#161515!important}.card{background:#211f1f!important}.ink{color:#f1efe9!important}.mute{color:#a9a59d!important}.rule{border-color:#33302f!important}.tint{background:#1b2040!important}a{color:#9db0ff!important}.btn a{background:#9db0ff!important;color:#161515!important}}
</style>
</head>
<body style="margin:0;padding:0;background:#f5f5f2;">
<!-- Merge tags: {{subject}} {{preheader}} {{first_name}} {{issue_number}} {{issue_date}} {{article_url}} {{site_url}} {{unsubscribe_url}} {{preferences_url}} {{postal_address}} -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{{preheader}}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background:#f5f5f2;">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="wrap" style="width:600px;max-width:600px;">

<tr><td class="pad" style="padding:0 32px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="ink serif" style="font-family:'Instrument Serif',Georgia,serif;font-size:26px;color:#262323;letter-spacing:-0.5px;">Dhidroid <span style="font-style:italic;">Labs</span></td>
<td align="right" class="mute" style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:13px;color:#7a7674;">Issue {{issue_number}} · {{issue_date}}</td>
</tr></table></td></tr>

<tr><td class="card" style="background:#fbfbf8;border-radius:16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td class="pad" style="padding:40px 32px 8px;">
<h1 class="h1 ink" style="margin:0;font-family:Inter,Arial,Helvetica,sans-serif;font-size:44px;line-height:1.1;font-weight:400;letter-spacing:-1px;color:#262323;">Notes from the lab.<br><span class="mute" style="color:#8a8683;">{{headline}}</span></h1>
</td></tr>
<tr><td class="pad" style="padding:16px 32px 28px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#4a4645;">
<p class="ink" style="margin:0;color:#4a4645;">Hi {{first_name}}, here is this issue’s short read on building useful software, plus what we have been trying in the lab.</p></td></tr>

<tr><td class="pad" style="padding:0 32px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="tint" style="background:#eef0ff;border-radius:12px;"><tr><td style="padding:24px;">
<p class="mute" style="margin:0 0 8px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:13px;font-weight:500;color:#3b4bdf;">Featured article</p>
<h2 class="ink serif" style="margin:0 0 10px;font-family:'Instrument Serif',Georgia,serif;font-size:30px;line-height:1.15;font-weight:400;color:#262323;">{{article_title}}</h2>
<p class="ink" style="margin:0 0 20px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#4a4645;">{{article_excerpt}}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn"><tr><td style="border-radius:8px;background:#262323;"><a href="{{article_url}}" style="display:inline-block;padding:13px 20px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Read the article</a></td></tr></table>
</td></tr></table></td></tr>

<tr><td class="pad" style="padding:0 32px 8px;"><h3 class="ink" style="margin:0 0 12px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:20px;font-weight:500;color:#262323;">From the lab</h3></td></tr>
<tr><td class="pad" style="padding:0 32px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td class="rule" style="padding:14px 0;border-top:1px solid #e4e3de;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#4a4645;"><strong class="ink" style="color:#262323;">{{lab_item_1_title}}</strong><br>{{lab_item_1_text}}</td></tr>
<tr><td class="rule" style="padding:14px 0;border-top:1px solid #e4e3de;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#4a4645;"><strong class="ink" style="color:#262323;">{{lab_item_2_title}}</strong><br>{{lab_item_2_text}}</td></tr>
<tr><td class="rule" style="padding:14px 0;border-top:1px solid #e4e3de;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#4a4645;"><strong class="ink" style="color:#262323;">{{lab_item_3_title}}</strong><br>{{lab_item_3_text}}</td></tr>
</table></td></tr>

<tr><td class="pad" style="padding:24px 32px 40px;">
<p class="ink serif" style="margin:0 0 6px;font-family:'Instrument Serif',Georgia,serif;font-size:26px;color:#262323;">One useful idea</p>
<p class="ink" style="margin:0;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#4a4645;">{{tip_text}}</p></td></tr>
</table></td></tr>

<tr><td class="pad" align="center" style="padding:32px 32px 8px;">
<p class="ink" style="margin:0 0 16px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:18px;color:#262323;">Have a problem worth solving?</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn"><tr><td style="border-radius:8px;background:#3b4bdf;"><a href="{{site_url}}/contact" style="display:inline-block;padding:13px 22px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Start a conversation</a></td></tr></table></td></tr>

<tr><td class="pad mute" align="center" style="padding:32px 32px 0;font-family:Inter,Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#7a7674;">
You are receiving this because you subscribed at <a href="{{site_url}}/newsletter">{{site_url}}/newsletter</a>.<br>
<a href="{{unsubscribe_url}}">Unsubscribe</a> · <a href="{{preferences_url}}">Email preferences</a><br>
<!-- [LEGAL REVIEW] Add the verified legal name and postal address required for commercial email. -->
Dhidroid Labs · Chennai, India · {{postal_address}}</td></tr>

</table></td></tr></table>
</body>
</html>`;

export function renderNewsletterHtml(
  data: Partial<NewsletterData>,
  templateHtml: string = NEWSLETTER_TEMPLATE_RAW
): string {
  const merged: NewsletterData = {
    ...DEFAULT_NEWSLETTER_DATA,
    ...data,
  };

  const map: Record<string, string> = {
    subject: String(merged.subject ?? ""),
    preheader: String(merged.preheader ?? ""),
    issue_number: String(merged.issue_number ?? ""),
    issue_date: String(merged.issue_date ?? ""),
    headline: String(merged.headline ?? ""),
    first_name: String(merged.first_name || "Friend"),
    article_title: String(merged.article_title ?? ""),
    article_excerpt: String(merged.article_excerpt ?? ""),
    article_url: String(merged.article_url ?? ""),
    lab_item_1_title: String(merged.lab_item_1_title ?? ""),
    lab_item_1_text: String(merged.lab_item_1_text ?? ""),
    lab_item_2_title: String(merged.lab_item_2_title ?? ""),
    lab_item_2_text: String(merged.lab_item_2_text ?? ""),
    lab_item_3_title: String(merged.lab_item_3_title ?? ""),
    lab_item_3_text: String(merged.lab_item_3_text ?? ""),
    tip_text: String(merged.tip_text ?? ""),
    site_url: String(merged.site_url ?? ""),
    unsubscribe_url: String(merged.unsubscribe_url ?? ""),
    preferences_url: String(merged.preferences_url ?? ""),
    postal_address: String(merged.postal_address ?? ""),
  };

  return templateHtml.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
    return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : `{{${key}}}`;
  });
}

export function renderNewsletterText(data: Partial<NewsletterData>): string {
  const merged = { ...DEFAULT_NEWSLETTER_DATA, ...data };
  return `Dhidroid Labs
Issue ${merged.issue_number} · ${merged.issue_date}

Notes from the lab: ${merged.headline}

Hi ${merged.first_name || "Friend"}, here is this issue’s short read on building useful software, plus what we have been trying in the lab.

FEATURED ARTICLE:
${merged.article_title}
${merged.article_excerpt}
Read more: ${merged.article_url}

FROM THE LAB:
* ${merged.lab_item_1_title}: ${merged.lab_item_1_text}
* ${merged.lab_item_2_title}: ${merged.lab_item_2_text}
* ${merged.lab_item_3_title}: ${merged.lab_item_3_text}

ONE USEFUL IDEA:
${merged.tip_text}

Start a conversation: ${merged.site_url}/contact
Unsubscribe: ${merged.unsubscribe_url}
Dhidroid Labs · Chennai, India · ${merged.postal_address}
`;
}
