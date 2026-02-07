import React from 'react';
import './ActionPlan.css';

function ActionPlan({ steps, timeline, recommendation }) {
  return (
    <div className="action-plan">
      <h3>🎯 Your Personalized Action Plan</h3>
      
      {recommendation && (
        <div className="key-recommendation">
          <div className="recommendation-icon">💡</div>
          <div className="recommendation-content">
            <h4>Key Recommendation</h4>
            <p>{recommendation}</p>
          </div>
        </div>
      )}

      <div className="timeline-estimate">
        <span className="timeline-icon">⏱️</span>
        <span className="timeline-text">
          Estimated timeline to become interview-ready: <strong>{timeline}</strong>
        </span>
      </div>

      <div className="action-steps">
        <h4>Action Items to Complete:</h4>
        <ol className="steps-list">
          {steps.map((step, index) => (
            <li key={index} className="step-item">
              <span className="step-number">{index + 1}</span>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="next-steps-cta">
        <p className="cta-text">
          💪 Ready to take action? Start with step 1 today and track your progress!
        </p>
      </div>
    </div>
  );
}

export default ActionPlan;
