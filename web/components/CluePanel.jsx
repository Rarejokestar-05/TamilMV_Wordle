"use client";

import { useEffect, useRef } from "react";
import { sounds } from "../lib/soundEffects";

export default function CluePanel({ clues = [], currentAttempts = 0 }) {
  const prevAttemptsRef = useRef(currentAttempts);

  useEffect(() => {
    // Play sound when a new clue unlocks
    if (
      (currentAttempts === 3 && prevAttemptsRef.current < 3) ||
      (currentAttempts === 5 && prevAttemptsRef.current < 5)
    ) {
      sounds.playClueUnlock();
    }
    prevAttemptsRef.current = currentAttempts;
  }, [currentAttempts]);

  return (
    <section className="clue-section" id="clues-panel" aria-label="Progressive Movie Clues">
      <div className="clue-header">
        <span>💡</span>
        <span>Detective Clues (Unlocks at Attempt 3 & 5)</span>
      </div>

      <div className="clue-cards-grid">
        {clues.map((clue) => (
          <div
            key={clue.id}
            id={`clue-card-${clue.id}`}
            className={`clue-card ${clue.isUnlocked ? "unlocked" : "locked"}`}
          >
            <div className={`clue-badge ${clue.isUnlocked ? "badge-unlocked" : "badge-locked"}`}>
              {clue.isUnlocked ? `🔓 ${clue.title}` : `🔒 Unlocks at Attempt ${clue.unlockAt}`}
            </div>
            <div
              className="clue-content"
              dangerouslySetInnerHTML={{ __html: clue.content }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
