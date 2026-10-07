"use client";

import { sounds } from "../lib/soundEffects";
import { useState } from "react";

export default function Header({ currentMode, onSelectMode, onOpenHelp, streak = 0 }) {
  const [muted, setMuted] = useState(false);

  const handleToggleSound = () => {
    const isMuted = sounds.toggleMute();
    setMuted(isMuted);
  };

  return (
    <header className="app-header" id="main-header">
      <div className="brand-top-row">
        <div className="brand-section">
          <div className="brand-logo-icon">🎬</div>
          <div>
            <h1 className="brand-title">KOLLYWOODDLE</h1>
            <div className="brand-subtitle">Tamil Cinema Movie Game</div>
          </div>
        </div>

        <div className="header-actions">
          {streak > 0 && (
            <div
              title={`Daily Streak: ${streak}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(245, 158, 11, 0.15)",
                color: "var(--accent-gold)",
                padding: "4px 10px",
                borderRadius: "20px",
                fontWeight: 800,
                fontSize: "12px",
                border: "1px solid rgba(245, 158, 11, 0.3)"
              }}
            >
              🔥 {streak}
            </div>
          )}

          <button
            id="btn-sound-toggle"
            className="icon-btn"
            onClick={handleToggleSound}
            title={muted ? "Unmute" : "Mute"}
            aria-label="Sound Toggle"
          >
            {muted ? "🔇" : "🔊"}
          </button>

          <button
            id="btn-how-to-play"
            className="icon-btn"
            onClick={onOpenHelp}
            title="How to Play"
            aria-label="How to play guide"
          >
            ❓
          </button>
        </div>
      </div>

      <nav className="mode-tabs" aria-label="Game Modes">
        <button
          id="mode-tab-daily"
          className={`mode-tab ${currentMode === "daily" ? "active" : ""}`}
          onClick={() => onSelectMode("daily")}
        >
          <span>🌟</span> Daily
        </button>
        <button
          id="mode-tab-unlimited"
          className={`mode-tab ${currentMode === "unlimited" ? "active" : ""}`}
          onClick={() => onSelectMode("unlimited")}
        >
          <span>♾️</span> Unlimited
        </button>
        <button
          id="mode-tab-room"
          className={`mode-tab ${currentMode === "room" ? "active" : ""}`}
          onClick={() => onSelectMode("room")}
        >
          <span>👥</span> 3v3 Room
        </button>
      </nav>
    </header>
  );
}
