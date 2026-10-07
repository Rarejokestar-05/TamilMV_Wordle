"use client";

export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" id="how-to-play-modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 800, marginBottom: "16px", color: "var(--accent-gold)" }}>
          🎬 How to Play Kollywooddle
        </h2>

        <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
          Can you guess the mystery Tamil movie in <strong>7 attempts</strong>? Each guess provides color-coded clues comparing your guess to the secret movie.
        </p>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ background: "var(--status-correct-bg)", border: "1px solid var(--status-correct)", color: "#34d399", padding: "6px 12px", borderRadius: "6px", fontWeight: 800, fontSize: "12px" }}>
              GREEN 🟩
            </span>
            <span style={{ fontSize: "13px", color: "#cbd5e1" }}>
              <strong>Exact Match!</strong> Same Director, Actor, Year, Genre, or Runtime.
            </span>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ background: "var(--status-partial-bg)", border: "1px solid var(--status-partial)", color: "#fbbf24", padding: "6px 12px", borderRadius: "6px", fontWeight: 800, fontSize: "12px" }}>
              YELLOW 🟨
            </span>
            <span style={{ fontSize: "13px", color: "#cbd5e1" }}>
              <strong>Close!</strong> Year within ±2 yrs, overlapping actors, shared genres, or runtime within ±15m.
            </span>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ background: "var(--status-wrong-bg)", border: "1px solid var(--status-wrong-border)", color: "#94a3b8", padding: "6px 12px", borderRadius: "6px", fontWeight: 800, fontSize: "12px" }}>
              DARK ⬛
            </span>
            <span style={{ fontSize: "13px", color: "#cbd5e1" }}>
              <strong>No Match</strong> for that attribute.
            </span>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "6px 14px", borderRadius: "6px", fontWeight: 800, fontSize: "12px" }}>
              ⬆️ / ⬇️
            </span>
            <span style={{ fontSize: "13px", color: "#cbd5e1" }}>
              The target film is <strong>Newer / Older</strong> (Year) or <strong>Longer / Shorter</strong> (Runtime).
            </span>
          </div>
        </div>

        {/* Clues Info */}
        <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
          <h4 style={{ color: "var(--accent-gold)", fontSize: "14px", marginBottom: "6px" }}>
            💡 Progressive Detective Clues
          </h4>
          <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>
            <li><strong>Attempt 3:</strong> Era & Studio clue unlocks!</li>
            <li><strong>Attempt 5:</strong> Redacted plot overview & co-star clue unlocks!</li>
          </ul>
        </div>

        <button className="btn-primary" style={{ width: "100%" }} onClick={onClose}>
          Got it! Let's Play 🔥
        </button>
      </div>
    </div>
  );
}
