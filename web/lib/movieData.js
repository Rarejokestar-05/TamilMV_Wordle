import allMovies from "../data/tamil_movies.json";

// In-memory cache
export const movies = allMovies;

// Get only Tier 1 (Iconic/Popular) for daily challenges
export const tier1Movies = movies.filter((m) => m.tier === 1);
// Tier 1 + Tier 2 for random play
export const playableMovies = movies.filter((m) => m.tier <= 2);

/**
 * Deterministically pick today's movie using the date as a seed
 */
export function getDailyMovie() {
  const today = new Date();
  // Format YYYYMMDD as integer
  const seedString = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % tier1Movies.length;
  return tier1Movies[index];
}

/**
 * Pick a random movie for Unlimited mode
 */
export function getRandomMovie() {
  const index = Math.floor(Math.random() * playableMovies.length);
  return playableMovies[index];
}

/**
 * Find movie by ID
 */
export function getMovieById(id) {
  return movies.find((m) => m.id === Number(id));
}

/**
 * Find movie by Title
 */
export function getMovieByTitle(title) {
  if (!title) return null;
  const clean = title.trim().toLowerCase();
  return movies.find((m) => m.title.toLowerCase() === clean);
}

/**
 * Autocomplete Search across all 2,333 movies
 */
export function searchMovies(query, limit = 8) {
  if (!query || query.trim().length < 1) return [];

  const q = query.trim().toLowerCase();
  const startsWithTitle = [];
  const containsTitle = [];
  const containsActorOrDir = [];

  for (const m of movies) {
    const titleLower = m.title.toLowerCase();
    const leadActorLower = (m.lead_actor || "").toLowerCase();
    const directorLower = (m.director || "").toLowerCase();

    if (titleLower === q) {
      startsWithTitle.unshift(m);
    } else if (titleLower.startsWith(q)) {
      startsWithTitle.push(m);
    } else if (titleLower.includes(q)) {
      containsTitle.push(m);
    } else if (leadActorLower.includes(q) || directorLower.includes(q)) {
      containsActorOrDir.push(m);
    }

    if (startsWithTitle.length >= limit) break;
  }

  const combined = [...startsWithTitle, ...containsTitle, ...containsActorOrDir];
  return combined.slice(0, limit);
}
