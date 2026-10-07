"use client";

export default function GuessGrid({ evaluatedGuesses, maxAttempts = 7 }) {
  const emptyRowsCount = Math.max(0, maxAttempts - evaluatedGuesses.length);

  return (
    <div className="grid-container" id="guess-grid-container">
      {evaluatedGuesses.length > 0 && (
        <div className="mobile-scroll-hint" aria-hidden="true">
          👈 Swipe table to reveal Cast, Genre & Runtime 👉
        </div>
      )}
      <table className="guess-table" aria-label="Movie Guesses Comparison Grid">
        <thead>
          <tr>
            <th scope="col" className="sticky-header">Movie</th>
            <th scope="col">Year</th>
            <th scope="col">Director</th>
            <th scope="col">Lead Actor</th>
            <th scope="col">Cast Overlap</th>
            <th scope="col">Genre</th>
            <th scope="col">Runtime</th>
          </tr>
        </thead>
        <tbody>
          {evaluatedGuesses.map((row, idx) => (
            <tr key={`${row.guess.id}-${idx}`} className="guess-row" id={`guess-row-${idx + 1}`}>
              {/* Movie Title (Sticky Left Column) */}
              <td className="cell-tile cell-title">
                <div>{row.guess.title}</div>
                <span className="cell-subtext">{row.guess.production_company || "Kollywood"}</span>
              </td>

              {/* Release Year */}
              <td className={`cell-tile ${row.year.status}`}>
                <span>{row.year.value}</span>
                {row.year.arrow && <span className="cell-indicator">{row.year.arrow}</span>}
              </td>

              {/* Director */}
              <td className={`cell-tile ${row.director.status}`}>
                <span>{row.director.value}</span>
              </td>

              {/* Lead Actor */}
              <td className={`cell-tile ${row.leadActor.status}`}>
                <span>{row.leadActor.value}</span>
              </td>

              {/* Cast Overlap */}
              <td className={`cell-tile ${row.cast.status}`}>
                <span>{row.cast.shared.length > 0 ? row.cast.shared.join(", ") : "None"}</span>
                {row.cast.shared.length > 0 && (
                  <span className="cell-subtext">({row.cast.shared.length} shared)</span>
                )}
              </td>

              {/* Genres */}
              <td className={`cell-tile ${row.genres.status}`}>
                <span>{row.genres.value}</span>
                {row.genres.shared.length > 0 && row.genres.status === "partial" && (
                  <span className="cell-subtext">Shared: {row.genres.shared.join(", ")}</span>
                )}
              </td>

              {/* Runtime */}
              <td className={`cell-tile ${row.runtime.status}`}>
                <span>{row.runtime.value}</span>
                {row.runtime.arrow && <span className="cell-indicator">{row.runtime.arrow}</span>}
              </td>
            </tr>
          ))}

          {/* Empty Placeholders */}
          {Array.from({ length: emptyRowsCount }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="empty-row" aria-hidden="true">
              <td className="cell-tile cell-title"></td>
              <td className="cell-tile"></td>
              <td className="cell-tile"></td>
              <td className="cell-tile"></td>
              <td className="cell-tile"></td>
              <td className="cell-tile"></td>
              <td className="cell-tile"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
