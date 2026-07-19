export default function LoadingSpinner({ label = "Chargement..." }) {
  return (
    <div className="loading-spinner-wrap">
      <div className="loading-spinner" role="status" aria-label={label}>
        <svg className="loading-spinner-svg" viewBox="0 0 50 50">
          <circle
            className="loading-spinner-track"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          />
          <circle
            className="loading-spinner-arc"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {label && <p className="loading-spinner-label">{label}</p>}
    </div>
  );
}