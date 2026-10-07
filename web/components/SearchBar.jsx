"use client";

import { useState, useEffect, useRef } from "react";
import { searchMovies } from "../lib/movieData";
import { sounds } from "../lib/soundEffects";

export default function SearchBar({ onSelectMovie, disabled = false, alreadyGuessedIds = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.trim().length >= 1) {
      const hits = searchMovies(query, 8);
      // Filter out already guessed
      const available = hits.filter((m) => !alreadyGuessedIds.includes(m.id));
      setResults(available);
      setIsOpen(available.length > 0);
      setActiveIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, alreadyGuessedIds]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (movie) => {
    sounds.playGuess();
    onSelectMovie(movie);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div className="search-container" ref={dropdownRef}>
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          id="movie-search-input"
          type="text"
          className="search-input"
          placeholder={disabled ? "Game over! Check results below" : "Type a Tamil movie name, hero, or director..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          disabled={disabled}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setQuery("")}
            aria-label="Clear search input"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="autocomplete-dropdown" id="search-suggestions" role="listbox">
          {results.map((movie, idx) => (
            <div
              key={movie.id}
              id={`suggestion-${movie.id}`}
              role="option"
              aria-selected={idx === activeIndex}
              className={`suggestion-item ${idx === activeIndex ? "active" : ""}`}
              onClick={() => handleSelect(movie)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <div>
                <div className="suggestion-title">{movie.title}</div>
                <div className="suggestion-meta">
                  <span>📅 {movie.year}</span>
                  <span>🎬 {movie.director}</span>
                  {movie.lead_actor && <span>⭐ {movie.lead_actor}</span>}
                </div>
              </div>
              <div>
                <span className={`suggestion-badge ${movie.tier === 1 ? "tier-1" : ""}`}>
                  {movie.tier === 1 ? "★ Iconic" : movie.genres?.[0] || "Kollywood"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
