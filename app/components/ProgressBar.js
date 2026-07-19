export default function ProgressBar({ value, showLabel = true, size = "md" }) {
  const pct = Math.round(value * 100);
  return (
    <div className={`progress-bar-wrap progress-bar-${size}`}>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="progress-bar-label">{pct}%</span>}
    </div>
  );
}