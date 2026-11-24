export function Marquee({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="mq" role="group" aria-label={label}>
      <div className="mq-t">{children}</div>
      <div className="mq-t" aria-hidden="true">{children}</div>
    </div>
  );
}
