"use client";

import { useState } from "react";
import { generateShareText } from "../lib/gameEngine";

export default function GameOverModal({
  isOpen,
  isWon,
  targetMovie,
  evaluatedGuesses,
  modeName,
  onPlayAgain,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !targetMovie) return null;

  const handleShare = async () => {
    const text = generateShareText(evaluatedGuesses, isWon, targetMovie, modeName);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="modal-overlay" id="game-over-modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "44px", marginBottom: "6px" }}>
            {isWon ? "🏆" : "🎬"}
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 800, color: isWon ? "var(--status-correct)" : "var(--accent-gold)" }}>
            {isWon ? "VERA LEVEL! YOU GUESSED IT!" : "BETTER LUCK NEXT TIME!"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            {isWon
              ? `You cracked it in ${evaluatedGuesses.length}/7 attempts!`
              : "All 7 chances were exhausted. Here is the secret movie:"}
          </p>
        </div>

        {/* Movie Showcase Card */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.45)",
            border: "1px solid var(--border-glow)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", color: "#fff", fontWeight: 800 }}>
              {targetMovie.title}
            </h3>
            <span style={{ color: "var(--accent-gold)", fontWeight: 700, fontSize: "16px" }}>
              {targetMovie.year}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "10px 0" }}>
            {targetMovie.genres?.map((g) => (
              <span key={g} style={{ background: "rgba(255,255,255,0.08)", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", color: "#cbd5e1" }}>
                {g}
              </span>
            ))}
            {targetMovie.runtime > 0 && (
              <span style={{ background: "rgba(245,158,11,0.15)", color: "var(--accent-gold)", padding: "3px 10px", borderRadius: "12px", fontSize: "11px" }}>
                ⏱️ {targetMovie.runtime} mins
              </span>
            )}
          </div>

          <div style={{ fontSize: "13px", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "6px", margin: "14px 0" }}>
            <div>🎬 <strong>Director:</strong> {targetMovie.director}</div>
            <div>⭐ <strong>Starring:</strong> {targetMovie.cast?.join(", ") || "Tamil Artists"}</div>
            <div>🏢 <strong>Production:</strong> {targetMovie.production_company || "Kollywood"}</div>
            {targetMovie.revenue_crores > 0 && (
              <div>💰 <strong>Box Office:</strong> ₹{targetMovie.revenue_crores} Crores</div>
            )}
          </div>

          {targetMovie.overview && (
            <p style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.5, background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", fontStyle: "italic", borderLeft: "3px solid var(--accent-gold)" }}>
              "{targetMovie.overview}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
          <button
            id="btn-share-score"
            className="btn-primary"
            onClick={handleShare}
          >
            <span>{copied ? "✅ Copied to Clipboard!" : "📋 Share Score (WhatsApp / Twitter)"}</span>
          </button>

          {onPlayAgain && (
            <button
              id="btn-play-again"
              className="btn-secondary"
              onClick={onPlayAgain}
            >
              🔄 Play Another Movie (Unlimited)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
