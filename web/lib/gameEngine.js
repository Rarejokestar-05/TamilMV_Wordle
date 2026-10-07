/**
 * Core Spotle Game Evaluation Engine
 */

export function evaluateGuess(guessMovie, targetMovie) {
  const isMatch = guessMovie.id === targetMovie.id;

  // 1. Year comparison
  const yearDiff = targetMovie.year - guessMovie.year;
  let yearStatus = "wrong";
  let yearArrow = "";
  if (yearDiff === 0) {
    yearStatus = "correct";
  } else {
    if (Math.abs(yearDiff) <= 2) {
      yearStatus = "partial";
    }
    yearArrow = yearDiff > 0 ? "↑" : "↓"; // Target is newer or older
  }

  // 2. Director comparison
  const targetDir = (targetMovie.director || "").trim().toLowerCase();
  const guessDir = (guessMovie.director || "").trim().toLowerCase();
  const directorStatus = targetDir === guessDir ? "correct" : "wrong";

  // 3. Lead Actor comparison
  const targetLead = (targetMovie.lead_actor || "").trim().toLowerCase();
  const guessLead = (guessMovie.lead_actor || "").trim().toLowerCase();
  const leadActorStatus = targetLead === guessLead ? "correct" : "wrong";

  // 4. Cast overlap (any shared actors)
  const targetCastSet = new Set((targetMovie.cast || []).map((c) => c.toLowerCase()));
  const sharedActors = (guessMovie.cast || []).filter((c) =>
    targetCastSet.has(c.toLowerCase())
  );
  let castStatus = "wrong";
  if (sharedActors.length > 0) {
    castStatus = sharedActors.length >= 2 || leadActorStatus === "correct" ? "correct" : "partial";
  }

  // 5. Genres overlap
  const targetGenres = (targetMovie.genres || []).map((g) => g.toLowerCase());
  const guessGenres = (guessMovie.genres || []).map((g) => g.toLowerCase());
  const sharedGenres = guessGenres.filter((g) => targetGenres.includes(g));

  let genreStatus = "wrong";
  if (
    targetGenres.length > 0 &&
    guessGenres.length > 0 &&
    targetGenres.sort().join(",") === guessGenres.sort().join(",")
  ) {
    genreStatus = "correct";
  } else if (sharedGenres.length > 0) {
    genreStatus = "partial";
  }

  // 6. Runtime comparison
  let runtimeStatus = "wrong";
  let runtimeArrow = "";
  if (targetMovie.runtime > 0 && guessMovie.runtime > 0) {
    const diff = targetMovie.runtime - guessMovie.runtime;
    if (diff === 0) {
      runtimeStatus = "correct";
    } else {
      if (Math.abs(diff) <= 15) {
        runtimeStatus = "partial";
      }
      runtimeArrow = diff > 0 ? "↑" : "↓"; // Target is longer or shorter
    }
  }

  return {
    isWon: isMatch,
    guess: guessMovie,
    year: {
      value: guessMovie.year,
      status: yearStatus,
      arrow: yearArrow,
    },
    director: {
      value: guessMovie.director || "Unknown",
      status: directorStatus,
    },
    leadActor: {
      value: guessMovie.lead_actor || "Unknown",
      status: leadActorStatus,
    },
    cast: {
      value: guessMovie.cast?.slice(0, 3).join(", ") || "Unknown",
      status: castStatus,
      shared: sharedActors,
    },
    genres: {
      value: guessMovie.genres?.join(", ") || "Unknown",
      status: genreStatus,
      shared: sharedGenres,
    },
    runtime: {
      value: guessMovie.runtime > 0 ? `${guessMovie.runtime}m` : "N/A",
      status: runtimeStatus,
      arrow: runtimeArrow,
    },
  };
}

/**
 * Generate progressive clues based on attempt number
 */
export function getClues(targetMovie, attemptCount) {
  const clues = [];

  // Clue 1: Unlocked on 3rd attempt
  const isClue1Unlocked = attemptCount >= 3;
  let clue1Text = "Locked until 3rd Attempt";
  if (isClue1Unlocked && targetMovie) {
    const prod = targetMovie.production_company !== "Unknown" ? targetMovie.production_company : "Prominent Studio";
    const releaseDecade = `${Math.floor(targetMovie.year / 10) * 10}s`;
    clue1Text = `Released in the <em>${releaseDecade}</em> (${targetMovie.release_date || targetMovie.year}). Produced by <em>${prod}</em>. Primary Genre: <em>${targetMovie.genres?.[0] || "Tamil Cinema"}</em>.`;
  }
  clues.push({
    id: 1,
    unlockAt: 3,
    isUnlocked: isClue1Unlocked,
    title: "Clue #1: Era & Production",
    content: clue1Text,
  });

  // Clue 2: Unlocked on 5th attempt (Plot Overview with Redacted Title)
  const isClue2Unlocked = attemptCount >= 5;
  let clue2Text = "Locked until 5th Attempt";
  if (isClue2Unlocked && targetMovie) {
    let cleanOverview = targetMovie.overview || "A sensational Tamil cinema blockbuster.";
    // Redact movie title from overview
    const regex = new RegExp(targetMovie.title, "gi");
    cleanOverview = cleanOverview.replace(regex, "[SECRET MOVIE]");
    const coStar = targetMovie.cast?.[1] ? ` Co-starring <em>${targetMovie.cast[1]}</em>.` : "";
    clue2Text = `<strong>Plot:</strong> "${cleanOverview}"${coStar}`;
  }
  clues.push({
    id: 2,
    unlockAt: 5,
    isUnlocked: isClue2Unlocked,
    title: "Clue #2: Plot Synopsis",
    content: clue2Text,
  });

  return clues;
}

/**
 * Generate Shareable Emoji Scorecard
 */
export function generateShareText(guesses, isWon, targetMovie, modeName = "Daily") {
  const title = `🎬 Kollywooddle (${modeName})\n`;
  const result = isWon ? `${guesses.length}/7 Attempts 🏆` : "X/7 Attempts 💀";
  
  const statusToEmoji = (status) => {
    if (status === "correct") return "🟩";
    if (status === "partial") return "🟨";
    return "⬛";
  };

  const grid = guesses
    .map((g) => {
      const row = [
        statusToEmoji(g.year.status),
        statusToEmoji(g.director.status),
        statusToEmoji(g.leadActor.status),
        statusToEmoji(g.genres.status),
        statusToEmoji(g.runtime.status),
      ];
      return row.join("");
    })
    .join("\n");

  return `${title}${result}\n\n${grid}\n\nPlay at: kollywooddle.app`;
}
