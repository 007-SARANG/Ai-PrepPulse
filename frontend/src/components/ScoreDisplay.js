import React from 'react';
import './ScoreDisplay.css';

function ScoreDisplay({ score, level }) {
  const getScoreColor = (score) => {
    if (score >= 75) return '#4caf50'; // Green
    if (score >= 60) return '#2196f3'; // Blue
    if (score >= 40) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const getLevelEmoji = (level) => {
    switch (level) {
      case 'Expert':
        return '🏆';
      case 'Advanced':
        return '⭐';
      case 'Intermediate':
        return '📈';
      default:
        return '🌱';
    }
  };

  const circumference = 2 * Math.PI * 70; // radius = 70
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="score-display">
      <div className="score-circle-container">
        <svg className="score-circle" width="200" height="200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            className="score-progress"
          />
        </svg>
        <div className="score-content">
          <div className="score-number">{score}</div>
          <div className="score-max">/100</div>
        </div>
      </div>

      <div className="readiness-level">
        <span className="level-emoji">{getLevelEmoji(level)}</span>
        <span className="level-text">{level}</span>
      </div>

      <div className="score-interpretation">
        {score >= 75 && (
          <p className="interpretation excellent">
            Excellent! You're well-prepared for interviews. Focus on maintaining your momentum.
          </p>
        )}
        {score >= 60 && score < 75 && (
          <p className="interpretation good">
            Good progress! You're on the right track. Address the gaps to become interview-ready.
          </p>
        )}
        {score >= 40 && score < 60 && (
          <p className="interpretation moderate">
            You're building a foundation. Focus on the action items to significantly improve.
          </p>
        )}
        {score < 40 && (
          <p className="interpretation needs-work">
            There's room for growth. Follow the action plan to build your interview readiness.
          </p>
        )}
      </div>
    </div>
  );
}

export default ScoreDisplay;
