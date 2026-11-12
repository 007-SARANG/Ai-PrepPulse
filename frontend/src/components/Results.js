import React from "react";
import ScoreDisplay from "./ScoreDisplay";
import ActionPlan from "./ActionPlan";
export default function Results({ results, onReset }) {
  const {
    overallScore,
    readinessLevel,
    breakdown = {},
    strengths = [],
    gaps = [],
    actionableSteps = [],
    timelineEstimate,
    keyRecommendation,
    targetRole,
  } = results;
  const method =
    results.analysisMethod === "gemini"
      ? "Gemini assessment"
      : results.analysisMethod === "rule-based"
        ? "Rule-based assessment"
        : "Preparation assessment";
  const categories = [
    ["technicalSkills", "Technical skills"],
    ["resumeQuality", "Resume quality"],
    ["communication", "Communication"],
    ["portfolio", "Online presence"],
  ];
  return (
    <div className="report">
      <div className="report-header">
        <div>
          <span className="report-method">{method}</span>
          <h1 id="view-title" tabIndex="-1">
            Your preparation report
          </h1>
          <p>
            {targetRole
              ? `A starting point for your next ${targetRole} interview.`
              : "A starting point for your next interview."}
          </p>
        </div>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => window.print()}
        >
          Print or save PDF
        </button>
      </div>
      {results.analysisMethod === "rule-based" && (
        <p className="method-note">
          Gemini was unavailable for this assessment. This report uses the app’s
          rule-based scoring of the information you supplied.
        </p>
      )}
      <div className="report-overview">
        <ScoreDisplay score={overallScore} level={readinessLevel} />
        <section className="breakdown" aria-labelledby="breakdown-title">
          <h2 id="breakdown-title">Where you stand</h2>
          <div className="breakdown-list">
            {categories.map(([key, label]) => {
              const value = Math.max(
                0,
                Math.min(100, Number(breakdown[key]) || 0),
              );
              return (
                <div className="breakdown-item" key={key}>
                  <div>
                    <span>{label}</span>
                    <strong>
                      {value}
                      <small> / 100</small>
                    </strong>
                  </div>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label={label}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={value}
                  >
                    <span style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <ActionPlan
        steps={actionableSteps}
        timeline={timelineEstimate}
        recommendation={keyRecommendation}
      />
      <div className="report-notes">
        <section>
          <h2>Keep building on</h2>
          <ul>
            {strengths.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
          {!strengths.length && (
            <p>No strengths were returned for this assessment.</p>
          )}
        </section>
        <section>
          <h2>Give more attention to</h2>
          <ul>
            {gaps.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
          {!gaps.length && (
            <p>
              No specific gaps were returned. Use the action plan to guide your
              next step.
            </p>
          )}
        </section>
      </div>
      <div className="report-actions">
        <button
          type="button"
          className="button button-primary"
          onClick={onReset}
        >
          Start a new assessment
        </button>
        <p>Change your inputs to explore a different preparation path.</p>
      </div>
    </div>
  );
}
