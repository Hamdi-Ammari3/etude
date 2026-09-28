"use client";

// Branded video thumbnail drawn entirely in code — no image to upload or load.
//   ┌──────────────────────────────────┐
//   │ 📐 Mathématiques                 │  subject pill
//   │                        📐 (faded)│
//   │   Les fractions — addition       │  lesson title (Arabic → right-to-left)
//   │                                  │
//   │ 🎒 Droussy TN · 📘 7ème     12:40 │  brand + grade (duration drawn by the card)
//   └──────────────────────────────────┘
// Set THUMBNAIL_MODE = "image" in lib/videoConfig.js to show the saved
// Cloudinary thumbnail instead.

import { THUMBNAIL_MODE, DEFAULT_THUMBNAIL_URL } from "../../lib/videoConfig";
import { subjectTheme, getGradeEmoji, getSubjectEmoji, getSubjectName, getGradeName, shortGradeLabel } from "../../lib/videoDisplay";
import "./videoThumbnail.css";

// Card-sized Cloudinary image (image mode only).
function cardImage(url) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/c_fill,w_480,h_270,f_auto,q_auto/");
}

export default function VideoThumbnail({ video, showSubject = true, mode = THUMBNAIL_MODE }) {
  if (mode === "image") {
    return (
      <img
        className="vthumb-img"
        src={cardImage(video.thumbnailUrl || DEFAULT_THUMBNAIL_URL)}
        alt=""
        loading="lazy"
        decoding="async"
      />
    );
  }

  const theme = subjectTheme(video.subjectId);
  const subjectEmoji = getSubjectEmoji(video.subjectId, video.subjectEmoji);
  const subjectName = getSubjectName(video.subjectId, video.subjectName);
  const title = (video.title || "").trim();
  const titleSize = title.length > 60 ? "vthumb-title-sm" : title.length > 32 ? "vthumb-title-md" : "";
  const gradeLabel = shortGradeLabel(getGradeName(video.gradeId, video.gradeName));

  return (
    <div className="vthumb" style={{ "--vt-color": theme.cssColor }} aria-hidden="true">
      <span className="vthumb-watermark">{subjectEmoji}</span>

      {showSubject && subjectName && (
        <span className="vthumb-subject">
          <span className="vthumb-emoji">{subjectEmoji}</span>
          <span className="vthumb-subject-name">{subjectName}</span>
        </span>
      )}

      <p className={`vthumb-title ${titleSize}`} dir="auto">
        {title}
      </p>

      <span className="vthumb-footer">
        <span className="vthumb-brand">
          <span className="vthumb-emoji">🎒</span> Droussy <span className="vthumb-brand-tn">TN</span>
        </span>
        {gradeLabel && (
          <span className="vthumb-grade">
            <span className="vthumb-emoji">{getGradeEmoji(video.gradeId)}</span> {gradeLabel}
          </span>
        )}
      </span>
    </div>
  );
}