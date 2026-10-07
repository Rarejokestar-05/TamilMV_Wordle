"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import GuessGrid from "../components/GuessGrid";
import CluePanel from "../components/CluePanel";
import GameOverModal from "../components/GameOverModal";
import HowToPlayModal from "../components/HowToPlayModal";
import RoomMode from "../components/RoomMode";

import { getDailyMovie, getRandomMovie } from "../lib/movieData";
import { evaluateGuess, getClues } from "../lib/gameEngine";
import { sounds } from "../lib/soundEffects";
import { fireConfetti } from "../lib/confetti";

export default function Home() {
  const [mode, setMode] = useState("daily"); // 'daily' | 'unlimited' | 'room'
  const [targetMovie, setTargetMovie] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [streak, setStreak] = useState(0);

  // Custom Room State
  const [roomConfig, setRoomConfig] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const maxAttempts = roomConfig ? roomConfig.maxAttempts : 7;

  // Initialize Game on Mount or Mode Change
  useEffect(() => {
    // Load daily streak from localStorage
    try {
      const savedStreak = parseInt(localStorage.getItem("kollywooddle_streak") || "0", 10);
      setStreak(savedStreak);
    } catch {
      // LocalStorage unavailable
    }

    startNewGame(mode);
  }, [mode]);

  // Timer for room mode
  useEffect(() => {
    if (!roomConfig || roomConfig.timerSeconds <= 0 || isGameOver) return;

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && guesses.length > 0) {
      // Time expired on a guess
    }
  }, [roomConfig, timeLeft, isGameOver, guesses.length]);

  const startNewGame = (gameMode) => {
    setIsGameOver(false);
    setIsWon(false);
    setShowGameOverModal(false);
    setGuesses([]);

    if (gameMode === "daily") {
      setRoomConfig(null);
      const daily = getDailyMovie();
      setTargetMovie(daily);

      // Check if user already played today's daily
      try {
        const todayKey = `kollywooddle_daily_${new Date().toISOString().slice(0, 10)}`;
        const savedGame = JSON.parse(localStorage.getItem(todayKey) || "null");
        if (savedGame) {
          setGuesses(savedGame.guesses || []);
          setIsGameOver(savedGame.isGameOver || false);
          setIsWon(savedGame.isWon || false);
          if (savedGame.isGameOver) {
            setShowGameOverModal(true);
          }
        }
      } catch {
        // Fallback
      }
    } else if (gameMode === "unlimited") {
      setRoomConfig(null);
      const random = getRandomMovie();
      setTargetMovie(random);
    } else if (gameMode === "room") {
      // Handled via RoomMode setup
    }
  };

  const handleStartCustomRoomGame = (config) => {
    setRoomConfig(config);
    setTargetMovie(config.targetMovie);
    setGuesses([]);
    setIsGameOver(false);
    setIsWon(false);
    setShowGameOverModal(false);
    if (config.timerSeconds > 0) {
      setTimeLeft(config.timerSeconds);
    }
  };

  const handleMakeGuess = (guessedMovie) => {
    if (isGameOver || !targetMovie) return;

    const evaluation = evaluateGuess(guessedMovie, targetMovie);
    const newGuesses = [...guesses, evaluation];
    setGuesses(newGuesses);

    // Reset round timer if active
    if (roomConfig?.timerSeconds > 0) {
      setTimeLeft(roomConfig.timerSeconds);
    }

    const won = evaluation.isWon;
    const lost = newGuesses.length >= maxAttempts && !won;

    if (won) {
      setIsGameOver(true);
      setIsWon(true);
      sounds.playWin();
      fireConfetti();
      setTimeout(() => setShowGameOverModal(true), 600);

      if (mode === "daily") {
        const newStreak = streak + 1;
        setStreak(newStreak);
        try {
          localStorage.setItem("kollywooddle_streak", newStreak.toString());
        } catch {}
      }
    } else if (lost) {
      setIsGameOver(true);
      setIsWon(false);
      sounds.playLoss();
      setTimeout(() => setShowGameOverModal(true), 600);

      if (mode === "daily") {
        try {
          localStorage.setItem("kollywooddle_streak", "0");
        } catch {}
        setStreak(0);
      }
    }

    // Save Daily State
    if (mode === "daily") {
      try {
        const todayKey = `kollywooddle_daily_${new Date().toISOString().slice(0, 10)}`;
        localStorage.setItem(
          todayKey,
          JSON.stringify({
            guesses: newGuesses,
            isGameOver: won || lost,
            isWon: won,
          })
        );
      } catch {}
    }
  };

  const clues = getClues(
    targetMovie,
    roomConfig && !roomConfig.enableClues ? 0 : guesses.length
  );
  const alreadyGuessedIds = guesses.map((g) => g.guess.id);

  return (
    <div className="app-container">
      <Header
        currentMode={mode}
        onSelectMode={(m) => setMode(m)}
        onOpenHelp={() => setShowHelpModal(true)}
        streak={streak}
      />

      <main className="game-layout">
        {mode === "room" && !roomConfig ? (
          <RoomMode onStartCustomGame={handleStartCustomRoomGame} />
        ) : (
          <>
            {/* Status Bar */}
            <div className="game-status-bar">
              <div className="chances-left">
                <span>Chances Remaining:</span>
                <div className="chances-dots">
                  {Array.from({ length: maxAttempts }).map((_, i) => (
                    <div
                      key={i}
                      className={`chance-dot ${i < maxAttempts - guesses.length ? "available" : "used"}`}
                    />
                  ))}
                </div>
                <span style={{ color: "var(--accent-gold)", marginLeft: "4px" }}>
                  ({Math.max(0, maxAttempts - guesses.length)}/{maxAttempts})
                </span>
              </div>

              {roomConfig && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", background: "rgba(245, 158, 11, 0.2)", padding: "4px 10px", borderRadius: "10px", color: "var(--accent-gold)", fontWeight: 700 }}>
                    🎯 Guesser: {roomConfig.teamGuesser}
                  </span>
                  {roomConfig.timerSeconds > 0 && (
                    <span style={{ fontWeight: 800, color: timeLeft <= 10 ? "var(--accent-ruby)" : "#fff", fontSize: "14px" }}>
                      ⏱️ {timeLeft}s
                    </span>
                  )}
                </div>
              )}

              {mode === "daily" && (
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  📅 Today's Movie Puzzle
                </div>
              )}

              {mode === "unlimited" && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: "6px 14px", fontSize: "12px" }}
                    onClick={() => startNewGame("unlimited")}
                  >
                    🎲 Skip / Random Movie
                  </button>
                </div>
              )}
            </div>

            {/* Search Bar Input */}
            <SearchBar
              onSelectMovie={handleMakeGuess}
              disabled={isGameOver}
              alreadyGuessedIds={alreadyGuessedIds}
            />

            {/* Clues Panel (Attempts 3 & 5) */}
            {(!roomConfig || roomConfig.enableClues) && (
              <CluePanel clues={clues} currentAttempts={guesses.length} />
            )}

            {/* Guess Table Grid */}
            <GuessGrid evaluatedGuesses={guesses} maxAttempts={maxAttempts} />
          </>
        )}
      </main>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOverModal}
        isWon={isWon}
        targetMovie={targetMovie}
        evaluatedGuesses={guesses}
        modeName={mode === "daily" ? "Daily" : mode === "unlimited" ? "Unlimited" : "3v3 Room"}
        onPlayAgain={
          mode === "unlimited"
            ? () => startNewGame("unlimited")
            : roomConfig
            ? () => {
                setRoomConfig(null);
                setMode("room");
              }
            : null
        }
        onClose={() => setShowGameOverModal(false)}
      />

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
