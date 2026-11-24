"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

export function Subscribe({
  id,
  large,
  confirmFromUrl = false,
}: {
  id: string;
  large?: boolean;
  confirmFromUrl?: boolean;
}) {
  const endpoint =
    process.env.NEXT_PUBLIC_NEWSLETTER_API_URL ||
    (process.env.NODE_ENV !== "test" ? "/api/newsletter" : undefined);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const confirmationStarted = useRef(false);

  useEffect(() => {
    if (!confirmFromUrl || !endpoint || confirmationStarted.current) return;

    const token = new URLSearchParams(window.location.search).get("confirm");
    if (!token) return;
    confirmationStarted.current = true;

    const confirmSubscription = async () => {
      setLoading(true);
      setMessage("Confirming your subscription…");
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "confirm", token }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setMessage(result.message);
        window.history.replaceState(null, "", window.location.pathname);
      } catch {
        setError(true);
        setMessage("We could not confirm your subscription. The link may have expired.");
      } finally {
        setLoading(false);
      }
    };

    void confirmSubscription();
  }, [confirmFromUrl, endpoint]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint) return;

    setLoading(true);
    setError(false);
    setMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "subscribe", email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setMessage(result.message);
      setEmail("");
    } catch {
      setError(true);
      setMessage("We could not process your signup. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={`sb${large ? " lg" : ""}`} onSubmit={handleSubmit}>
      <label htmlFor={id}>Email</label>
      <input
        id={id}
        type="email"
        name="email"
        required
        placeholder="you@mail.com"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={!endpoint || loading}
      />
      <button className="btn ink" type="submit" disabled={!endpoint || loading}>
        {loading ? "Please wait…" : endpoint ? "Subscribe" : "Opening soon"}
      </button>
      {message && <p role={error ? "alert" : "status"}>{message}</p>}
    </form>
  );
}
