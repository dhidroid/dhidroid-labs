"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import {
  DEFAULT_NEWSLETTER_DATA,
  NewsletterData,
  renderNewsletterHtml,
} from "../../lib/newsletter-template";

export function CustomNewsletter() {
  const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_API_URL;

  const [form, setForm] = useState<NewsletterData>({ ...DEFAULT_NEWSLETTER_DATA });
  const [sendMode, setSendMode] = useState<"test" | "broadcast">("test");
  const [testEmail, setTestEmail] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"visual" | "html">("visual");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState(false);

  const renderedHtml = renderNewsletterHtml(form);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    setForm({ ...DEFAULT_NEWSLETTER_DATA });
    setStatusMessage("Reset form to default sample newsletter.");
    setIsError(false);
  }

  async function handleCopyHtml() {
    try {
      await navigator.clipboard.writeText(renderedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  }

  async function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!endpoint) {
      setIsError(true);
      setStatusMessage(
        "Newsletter API endpoint is not set. Please configure NEXT_PUBLIC_NEWSLETTER_API_URL."
      );
      return;
    }

    if (sendMode === "test" && !testEmail.trim()) {
      setIsError(true);
      setStatusMessage("Please provide a recipient email address for test sending.");
      return;
    }

    setLoading(true);
    setStatusMessage("");
    setIsError(false);

    try {
      const payload: Record<string, unknown> = {
        action: "send_newsletter",
        newsletter: form,
      };

      if (sendMode === "test") {
        payload.testEmail = testEmail.trim();
      }

      if (adminKey.trim()) {
        payload.adminKey = adminKey.trim();
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminKey.trim() ? { "X-Admin-Key": adminKey.trim() } : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to dispatch newsletter.");
      }

      setIsError(false);
      setStatusMessage(result.message || "Newsletter successfully sent!");
    } catch (err: unknown) {
      setIsError(true);
      setStatusMessage(
        err instanceof Error ? err.message : "Failed to connect to newsletter service."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="custom-nl-container">
      <div className="custom-nl-top-bar">
        <Link href="/newsletter" className="back">
          ← Back to Newsletter
        </Link>
        <div className="custom-nl-endpoint-tag">
          <span className="dot" style={{ background: endpoint ? "#22c55e" : "#eab308" }} />
          Endpoint: {endpoint ? "Configured" : "Not configured (read-only preview)"}
        </div>
      </div>

      <div className="custom-nl-grid">
        {/* Left Column: Editor Form */}
        <section className="custom-nl-editor-col">
          <div className="custom-nl-card">
            <div className="custom-nl-card-header">
              <h2>Compose Newsletter</h2>
              <button
                type="button"
                onClick={handleReset}
                className="btn line"
                style={{ height: 32, fontSize: 13, padding: "0 10px" }}
              >
                Reset to Sample
              </button>
            </div>

            <form onSubmit={handleSend} className="custom-nl-form">
              {/* Section: Issue Info */}
              <fieldset className="custom-nl-fieldset">
                <legend>Issue Metadata</legend>
                <div className="custom-nl-row-2">
                  <div className="custom-nl-field">
                    <label htmlFor="issue_number">Issue Number</label>
                    <input
                      id="issue_number"
                      name="issue_number"
                      value={form.issue_number}
                      onChange={handleChange}
                      placeholder="01"
                      required
                    />
                  </div>
                  <div className="custom-nl-field">
                    <label htmlFor="issue_date">Issue Date</label>
                    <input
                      id="issue_date"
                      name="issue_date"
                      value={form.issue_date}
                      onChange={handleChange}
                      placeholder="November 2026"
                      required
                    />
                  </div>
                </div>

                <div className="custom-nl-field">
                  <label htmlFor="subject">Email Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Notes from the lab · Issue 01"
                    required
                  />
                </div>

                <div className="custom-nl-field">
                  <label htmlFor="preheader">Preheader (Inbox Preview snippet)</label>
                  <input
                    id="preheader"
                    name="preheader"
                    value={form.preheader}
                    onChange={handleChange}
                    placeholder="Short summary visible in inbox preview..."
                  />
                </div>

                <div className="custom-nl-field">
                  <label htmlFor="headline">Headline Subtitle</label>
                  <input
                    id="headline"
                    name="headline"
                    value={form.headline}
                    onChange={handleChange}
                    placeholder="Engineering ideas into useful products."
                  />
                </div>

                <div className="custom-nl-field">
                  <label htmlFor="first_name">Default Greeting Name</label>
                  <input
                    id="first_name"
                    name="first_name"
                    value={form.first_name || ""}
                    onChange={handleChange}
                    placeholder="Friend (or subscriber name)"
                  />
                </div>
              </fieldset>

              {/* Section: Featured Article */}
              <fieldset className="custom-nl-fieldset">
                <legend>Featured Article</legend>
                <div className="custom-nl-field">
                  <label htmlFor="article_title">Article Title</label>
                  <input
                    id="article_title"
                    name="article_title"
                    value={form.article_title}
                    onChange={handleChange}
                    placeholder="Article title..."
                    required
                  />
                </div>

                <div className="custom-nl-field">
                  <label htmlFor="article_excerpt">Article Excerpt</label>
                  <textarea
                    id="article_excerpt"
                    name="article_excerpt"
                    rows={3}
                    value={form.article_excerpt}
                    onChange={handleChange}
                    placeholder="Short summary of the article..."
                    required
                  />
                </div>

                <div className="custom-nl-field">
                  <label htmlFor="article_url">Article URL</label>
                  <input
                    id="article_url"
                    name="article_url"
                    type="url"
                    value={form.article_url}
                    onChange={handleChange}
                    placeholder="https://dhidroid-labs.dhidroid.workers.dev/blog/..."
                    required
                  />
                </div>
              </fieldset>

              {/* Section: From the Lab */}
              <fieldset className="custom-nl-fieldset">
                <legend>From the Lab (Experiments & Notes)</legend>
                {/* Item 1 */}
                <div className="custom-nl-subitem">
                  <div className="custom-nl-field">
                    <label htmlFor="lab_item_1_title">Item 1 Title</label>
                    <input
                      id="lab_item_1_title"
                      name="lab_item_1_title"
                      value={form.lab_item_1_title}
                      onChange={handleChange}
                      placeholder="e.g. Cross-platform gesture handling"
                    />
                  </div>
                  <div className="custom-nl-field">
                    <label htmlFor="lab_item_1_text">Item 1 Details</label>
                    <input
                      id="lab_item_1_text"
                      name="lab_item_1_text"
                      value={form.lab_item_1_text}
                      onChange={handleChange}
                      placeholder="Brief description of what was tested..."
                    />
                  </div>
                </div>

                {/* Item 2 */}
                <div className="custom-nl-subitem">
                  <div className="custom-nl-field">
                    <label htmlFor="lab_item_2_title">Item 2 Title</label>
                    <input
                      id="lab_item_2_title"
                      name="lab_item_2_title"
                      value={form.lab_item_2_title}
                      onChange={handleChange}
                      placeholder="e.g. Offline sync engines"
                    />
                  </div>
                  <div className="custom-nl-field">
                    <label htmlFor="lab_item_2_text">Item 2 Details</label>
                    <input
                      id="lab_item_2_text"
                      name="lab_item_2_text"
                      value={form.lab_item_2_text}
                      onChange={handleChange}
                      placeholder="Brief description..."
                    />
                  </div>
                </div>

                {/* Item 3 */}
                <div className="custom-nl-subitem">
                  <div className="custom-nl-field">
                    <label htmlFor="lab_item_3_title">Item 3 Title</label>
                    <input
                      id="lab_item_3_title"
                      name="lab_item_3_title"
                      value={form.lab_item_3_title}
                      onChange={handleChange}
                      placeholder="e.g. Low-latency API proxies"
                    />
                  </div>
                  <div className="custom-nl-field">
                    <label htmlFor="lab_item_3_text">Item 3 Details</label>
                    <input
                      id="lab_item_3_text"
                      name="lab_item_3_text"
                      value={form.lab_item_3_text}
                      onChange={handleChange}
                      placeholder="Brief description..."
                    />
                  </div>
                </div>
              </fieldset>

              {/* Section: One Useful Idea */}
              <fieldset className="custom-nl-fieldset">
                <legend>One Useful Idea</legend>
                <div className="custom-nl-field">
                  <label htmlFor="tip_text">Takeaway Tip</label>
                  <textarea
                    id="tip_text"
                    name="tip_text"
                    rows={3}
                    value={form.tip_text}
                    onChange={handleChange}
                    placeholder="A concrete takeaway readers can apply today..."
                  />
                </div>
              </fieldset>

              {/* Section: Send Options & Dispatch */}
              <fieldset className="custom-nl-fieldset highlight">
                <legend>Dispatch Options</legend>
                <div className="custom-nl-field">
                  <label>Sending Target</label>
                  <div className="custom-nl-radios">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="sendMode"
                        value="test"
                        checked={sendMode === "test"}
                        onChange={() => setSendMode("test")}
                      />
                      Send Test Email
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="sendMode"
                        value="broadcast"
                        checked={sendMode === "broadcast"}
                        onChange={() => setSendMode("broadcast")}
                      />
                      Broadcast to Confirmed Subscribers
                    </label>
                  </div>
                </div>

                {sendMode === "test" && (
                  <div className="custom-nl-field">
                    <label htmlFor="testEmail">Recipient Test Email</label>
                    <input
                      id="testEmail"
                      name="testEmail"
                      type="email"
                      placeholder="your-test@domain.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      required={sendMode === "test"}
                    />
                  </div>
                )}

                <div className="custom-nl-field">
                  <label htmlFor="adminKey">Admin Key (if configured on backend)</label>
                  <input
                    id="adminKey"
                    name="adminKey"
                    type="password"
                    placeholder="Enter secret key if required..."
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                  />
                </div>

                <div className="custom-nl-actions">
                  <button
                    type="submit"
                    className="btn ink"
                    disabled={loading || !endpoint}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {loading
                      ? "Sending newsletter…"
                      : sendMode === "test"
                      ? "Send Test Newsletter"
                      : "Broadcast Custom Newsletter"}
                  </button>
                </div>

                {statusMessage && (
                  <div
                    className={`custom-nl-alert ${isError ? "error" : "success"}`}
                    role={isError ? "alert" : "status"}
                  >
                    {statusMessage}
                  </div>
                )}
              </fieldset>
            </form>
          </div>
        </section>

        {/* Right Column: Template Preview */}
        <section className="custom-nl-preview-col">
          <div className="custom-nl-card sticky">
            <div className="custom-nl-preview-header">
              <div className="custom-nl-tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "visual" ? "active" : ""}`}
                  onClick={() => setActiveTab("visual")}
                >
                  Live Visual Preview
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "html" ? "active" : ""}`}
                  onClick={() => setActiveTab("html")}
                >
                  HTML Template Source
                </button>
              </div>

              <div className="custom-nl-preview-controls">
                {activeTab === "visual" ? (
                  <div className="viewport-toggle">
                    <button
                      type="button"
                      className={`size-btn ${viewport === "desktop" ? "active" : ""}`}
                      onClick={() => setViewport("desktop")}
                      title="Desktop view (600px)"
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      className={`size-btn ${viewport === "mobile" ? "active" : ""}`}
                      onClick={() => setViewport("mobile")}
                      title="Mobile view (375px)"
                    >
                      Mobile
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn line"
                    style={{ height: 28, fontSize: 12, padding: "0 10px" }}
                    onClick={handleCopyHtml}
                  >
                    {copied ? "Copied!" : "Copy HTML"}
                  </button>
                )}
              </div>
            </div>

            <div className="custom-nl-preview-body">
              {activeTab === "visual" ? (
                <div
                  className={`iframe-wrapper ${viewport === "mobile" ? "mobile-size" : "desktop-size"}`}
                >
                  <iframe
                    title="Newsletter Preview"
                    srcDoc={renderedHtml}
                    className="newsletter-iframe"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <pre className="html-preview-code">
                  <code>{renderedHtml}</code>
                </pre>
              )}
            </div>
            <p className="cap2" style={{ padding: "10px 16px" }}>
              Template: <code>public/newsletter-template.html</code>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
