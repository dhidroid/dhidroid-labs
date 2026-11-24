export default function Loading() {
  return (
    <div className="ldr" aria-label="Loading" role="status">
      <div className="ldr-logo">
        Dhidroid <i>Labs</i>
      </div>
      <div className="ldr-bar">
        <div className="ldr-bar-fill" />
      </div>
      <span className="ldr-hint">Loading…</span>
    </div>
  );
}
