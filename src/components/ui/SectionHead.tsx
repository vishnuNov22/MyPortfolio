/** Section tag ("03 — Selected work") + heading ending in one serif-italic word. */
export default function SectionHead({
  index,
  label,
  title,
  accent,
  id,
  className = "",
}: {
  index: string;
  label: string;
  title: string;
  accent: string;
  id: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <p className="tag rv">
        <b>{index}</b> — {label}
      </p>
      <h2 className="h-sec" id={id}>
        <span className="rv-mask">
          <span>
            {title} <span className="it">{accent}</span>
          </span>
        </span>
      </h2>
    </header>
  );
}
