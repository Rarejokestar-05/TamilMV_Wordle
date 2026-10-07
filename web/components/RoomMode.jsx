"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import { getMovieById } from "../lib/movieData";
import { sounds } from "../lib/soundEffects";

export default function RoomMode({ onStartCustomGame }) {
  const [step, setStep] = useState("setup"); // setup | selecting_movie | room_code
  const [team1Name, setTeam1Name] = useState("Team A (Anbu)");
  const [team2Name, setTeam2Name] = useState("Team B (Rolex)");
  const [activeChooser, setActiveChooser] = useState(1); // Team 1 picks for Team 2
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [maxAttempts, setMaxAttempts] = useState(7);
  const [enableClues, setEnableClues] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0); // 0 = no timer
  const [roomCode, setRoomCode] = useState("");
  const [inputRoomCode, setInputRoomCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate random room code
  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "KLY-";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleStartSelecting = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setStep("selecting_movie");
  };

  const handleConfirmMovie = () => {
    if (!selectedMovie) return;
    sounds.playWin();

    const gameConfig = {
      isRoomMode: true,
      roomCode,
      targetMovie: selectedMovie,
      maxAttempts: Number(maxAttempts),
      enableClues,
      timerSeconds: Number(timerSeconds),
      teamChooser: activeChooser === 1 ? team1Name : team2Name,
      teamGuesser: activeChooser === 1 ? team2Name : team1Name,
      onRoundFinished: () => {
        // Toggle chooser for the next round
        setActiveChooser((prev) => (prev === 1 ? 2 : 1));
        setSelectedMovie(null);
        setStep("selecting_movie");
      },
    };

    onStartCustomGame(gameConfig);
  };

  const handleJoinViaCode = () => {
    if (!inputRoomCode.trim()) return;
    // Decode if encoded or random movie
    alert(`Connected to Room ${inputRoomCode.trim().toUpperCase()}! Ready for Battle.`);
  };

  return (
    <div className="room-container" id="room-mode-container">
      {step === "setup" && (
        <div className="glass-panel room-creation-card">
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "36px" }}>⚔️</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", color: "var(--accent-gold)", fontWeight: 800 }}>
              3v3 / Local Friends Battle Mode
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Challenge your friends locally! One team secretly picks a Tamil movie, and the other team has to guess it under custom rules.
            </p>
          </div>

          <div className="room-grid-two">
            <div className="room-input-group">
              <label className="room-label">Team 1 Name</label>
              <input
                type="text"
                className="room-input"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
              />
            </div>
            <div className="room-input-group">
              <label className="room-label">Team 2 Name</label>
              <input
                type="text"
                className="room-input"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
              />
            </div>
          </div>

          <div className="room-grid-three">
            <div className="room-input-group">
              <label className="room-label">Attempts Allowed</label>
              <select
                className="room-input"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(e.target.value)}
              >
                <option value={5}>5 Chances (Hard)</option>
                <option value={7}>7 Chances (Standard)</option>
                <option value={10}>10 Chances (Party)</option>
              </select>
            </div>

            <div className="room-input-group">
              <label className="room-label">Detective Clues</label>
              <select
                className="room-input"
                value={enableClues ? "yes" : "no"}
                onChange={(e) => setEnableClues(e.target.value === "yes")}
              >
                <option value="yes">Enabled (At 3 & 5)</option>
                <option value="no">Disabled (Hardcore)</option>
              </select>
            </div>

            <div className="room-input-group">
              <label className="room-label">Timer per Guess</label>
              <select
                className="room-input"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(e.target.value)}
              >
                <option value={0}>No Timer (Relaxed)</option>
                <option value={45}>45 Seconds</option>
                <option value={60}>60 Seconds</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "14px", marginTop: "10px" }}>
            <button
              id="btn-create-room"
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={handleStartSelecting}
            >
              🎮 Create Room & Pick Secret Movie
            </button>
          </div>

          {/* Room Code Entry */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "18px", marginTop: "8px" }}>
            <div style={{ fontSize: "12px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontWeight: 700 }}>
              Or Join an Existing Room Code
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="e.g. KLY-8291"
                className="room-input"
                style={{ flex: 1, textTransform: "uppercase" }}
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value)}
              />
              <button className="btn-secondary" onClick={handleJoinViaCode}>
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "selecting_movie" && (
        <div className="glass-panel room-creation-card">
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-block", background: "rgba(245, 158, 11, 0.2)", color: "var(--accent-gold)", padding: "4px 16px", borderRadius: "20px", fontWeight: 800, fontSize: "12px", marginBottom: "8px" }}>
              ROOM: {roomCode}
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", color: "#fff", fontWeight: 800 }}>
              🤫 Secret Turn: <span style={{ color: "var(--accent-gold)" }}>{activeChooser === 1 ? team1Name : team2Name}</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Don't let the opposing team ({activeChooser === 1 ? team2Name : team1Name}) see your screen! Search and select the secret Tamil film they must guess.
            </p>
          </div>

          <div style={{ margin: "16px 0" }}>
            <SearchBar
              onSelectMovie={(movie) => setSelectedMovie(movie)}
              disabled={false}
              alreadyGuessedIds={[]}
            />
          </div>

          {selectedMovie && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "11px", color: "#34d399", fontWeight: 800, textTransform: "uppercase" }}>
                  Selected Secret Movie:
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>
                  {selectedMovie.title} ({selectedMovie.year})
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Directed by {selectedMovie.director} • Starring {selectedMovie.lead_actor}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handleConfirmMovie}
                style={{ padding: "10px 20px", fontSize: "14px" }}
              >
                🔒 Lock Movie & Hand Over Screen
              </button>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <button
              className="btn-secondary"
              style={{ fontSize: "12px", padding: "8px 16px" }}
              onClick={() => setStep("setup")}
            >
              ← Back to Room Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
