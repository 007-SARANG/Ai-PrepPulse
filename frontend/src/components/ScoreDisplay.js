import React from "react";
export default function ScoreDisplay({ score, level }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  return (
    <div className="score-display">
      <p className="score-label">Overall preparation score</p>
      <div className="score-value">
        {value}
        <span>/ 100</span>
      </div>
      <span className="readiness-level">{level || "Assessment complete"}</span>
      <p className="score-note">
        Use this as a starting point for preparation. Your action plan matters
        more than the number.
      </p>
    </div>
  );
}
