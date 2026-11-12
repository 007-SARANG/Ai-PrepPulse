import React from "react";
export default function ActionPlan({ steps = [], timeline, recommendation }) {
  return (
    <section className="action-plan" aria-labelledby="action-title">
      <div className="report-section-heading">
        <div>
          <h2 id="action-title">Make your next move</h2>
          <p>A focused plan to take forward.</p>
        </div>
        {timeline && (
          <span className="timeline">Suggested horizon: {timeline}</span>
        )}
      </div>
      {recommendation && (
        <div className="recommendation">
          <h3>Start here</h3>
          <p>{recommendation}</p>
        </div>
      )}
      <ol className="action-steps">
        {steps.map((step, i) => (
          <li key={i}>
            <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
      {!steps.length && (
        <p className="empty-note">
          No specific action items were returned. Try adding more detail to your
          profile.
        </p>
      )}
    </section>
  );
}
