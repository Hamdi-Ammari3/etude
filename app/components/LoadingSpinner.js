import {FiLoader} from "react-icons/fi";

export default function LoadingSpinner({ label = "Chargement..." }) {
  return (
    <div className="loading-spinner-wrap">
      <FiLoader className="spin-icon" />
      {label && <p className="loading-spinner-label">{label}</p>}
    </div>
  );
}