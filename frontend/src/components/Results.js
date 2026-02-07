import React from 'react';
import ScoreDisplay from './ScoreDisplay';
import ActionPlan from './ActionPlan';
import './Results.css';

function Results({ results, onReset }) {
  const { 
    overallScore, 
    readinessLevel, 
    breakdown, 
    strengths, 
    gaps, 
    actionableSteps, 
    timelineEstimate,
    keyRecommendation,
    processingTime,
    userInputTime
  } = results;

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>🎉 Your Interview Readiness Report</h2>
        <p className="processing-info">
          Completed in {userInputTime} (user) + {processingTime} (analysis) = Total Time: {(parseFloat(userInputTime) + parseFloat(processingTime)).toFixed(1)}s
        </p>
      </div>

      <div className="results-grid">
        {/* Overall Score Card */}
        <div className="result-card score-card">
          <h3>📊 Overall Readiness Score</h3>
          <ScoreDisplay score={overallScore} level={readinessLevel} />
        </div>

        {/* Breakdown Card */}
        <div className="result-card breakdown-card">
          <h3>📈 Detailed Breakdown</h3>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">🛠️ Technical Skills</span>
                <span className="breakdown-score">{breakdown.technicalSkills}/100</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill technical"
                  style={{ width: `${breakdown.technicalSkills}%` }}
                />
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">📄 Resume Quality</span>
                <span className="breakdown-score">{breakdown.resumeQuality}/100</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill resume"
                  style={{ width: `${breakdown.resumeQuality}%` }}
                />
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">💬 Communication</span>
                <span className="breakdown-score">{breakdown.communication}/100</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill communication"
                  style={{ width: `${breakdown.communication}%` }}
                />
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">🌐 Portfolio/Presence</span>
                <span className="breakdown-score">{breakdown.portfolio}/100</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill portfolio"
                  style={{ width: `${breakdown.portfolio}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Strengths Card */}
        <div className="result-card strengths-card">
          <h3>✨ Your Strengths</h3>
          <ul className="strengths-list">
            {strengths.map((strength, index) => (
              <li key={index}>
                <span className="bullet">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps Card */}
        <div className="result-card gaps-card">
          <h3>🎯 Areas to Improve</h3>
          <ul className="gaps-list">
            {gaps.map((gap, index) => (
              <li key={index}>
                <span className="bullet">⚠</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Plan Card */}
        <div className="result-card action-card full-width">
          <ActionPlan 
            steps={actionableSteps}
            timeline={timelineEstimate}
            recommendation={keyRecommendation}
          />
        </div>
      </div>

      <div className="results-actions">
        <button className="reset-btn" onClick={onReset}>
          🔄 Take Another Assessment
        </button>
        <button className="download-btn" onClick={() => window.print()}>
          📥 Download Report
        </button>
      </div>
    </div>
  );
}

export default Results;
