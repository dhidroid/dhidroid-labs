// Set NEXT_PUBLIC_NEWSLETTER_ACTION to your email provider's form URL to enable signups.
const action = process.env.NEXT_PUBLIC_NEWSLETTER_ACTION;

export function Subscribe({ id, large }: { id: string; large?: boolean }) {
  return (
    <form className={`sb${large ? " lg" : ""}`} action={action} method="post">
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" name="email" required placeholder="you@company.com" autoComplete="email" />
      <button className="btn ink" type="submit" disabled={!action}>{action ? "Subscribe" : "Opening soon"}</button>
    </form>
  );
}
