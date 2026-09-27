// Shared video rules — safe to import from both client and server code
// (no secrets here).

export const VIEW_RATE_DT = 0.1; // 0,1 DT per unique qualified view
export const VIEW_RATE_MILLIMES = 100; // same rate in integer millimes (no float drift in totals)
export const PAYOUT_THRESHOLD_DT = 100; // teacher is paid once the balance reaches this amount

// Teacher account fields (users/{teacherId}) — all money in integer millimes.
// Written ONLY by the server (heartbeat route + payout script).
export const TEACHER_FIELDS = {
  BALANCE: "videoBalanceMillimes", // earned, not yet paid → reset by payouts
  VIEWS_TOTAL: "videoViewsTotal", // all-time qualified views
  EARNED_TOTAL: "videoEarnedMillimes", // all-time earnings
  PAID_TOTAL: "videoPaidMillimes", // all-time amount paid out
};

export function millimesToDT(millimes) {
  return Math.round(Number(millimes) || 0) / 1000;
}
export const VIEW_THRESHOLD = 0.5; // a student must really watch 50% of the video's distinct chunks

// View tracking
export const CHUNK_SEC = 10; // the video is split in 10-second chunks
export const CHUNK_PLAYED_RATIO = 0.8; // a chunk counts once 80% of it actually played
export const HEARTBEAT_MS = 15000; // browser → server progress report interval
export const MAX_PLAYBACK_RATE = 2; // fastest speed we accept (2x)
export const REQUIRE_REVIEW = true; // encoded videos go to "pending" until an admin publishes them

export const MIN_DURATION_SEC = 120; // blocks very short clips gaming the 40% threshold
export const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
export const MAX_THUMB_BYTES = 5 * 1024 * 1024; // 5 MB

export const TITLE_MIN = 5;
export const TITLE_MAX = 120;

export const TRIMESTRES = [
  { id: 1, label: "Trimestre 1" },
  { id: 2, label: "Trimestre 2" },
  { id: 3, label: "Trimestre 3" },
];

// Lifecycle of a video doc:
// uploading → encoding → pending (review) → published
//                      ↘ failed             ↘ rejected
export const VIDEO_STATUS = {
  UPLOADING: "uploading",
  ENCODING: "encoding",
  PENDING: "pending",
  PUBLISHED: "published",
  REJECTED: "rejected",
  FAILED: "failed",
};

export const STATUS_LABELS = {
  uploading: "⏫ Envoi en cours",
  encoding: "⚙️ Traitement",
  pending: "⏳ En validation",
  published: "✅ Publiée",
  rejected: "❌ Refusée",
  failed: "⚠️ Échec de l'envoi",
};

// Statuses that are still changing and worth polling from the dashboard.
export const IN_PROGRESS_STATUSES = ["uploading", "encoding"];

export const BUNNY_TUS_ENDPOINT = "https://video.bunnycdn.com/tusupload";