import React, { useEffect, useState } from "react";
import AssessmentForm from "./components/AssessmentForm";
import Results from "./components/Results";
import "./App.css";

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.getElementById("view-title")?.focus();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [results]);
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="PrepPulse home">
          <span className="brand-symbol" aria-hidden="true">
            p.
          </span>
          PrepPulse<span className="brand-ai">AI</span>
        </a>
        <span className="header-note">
          A little clarity. A better next step.
        </span>
        <a
          className="quiet-link"
          href="https://sarangbuilds.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          Built by Sarang <span aria-hidden="true">↗</span>
        </a>
      </header>
      <main id="main" className="app-main">
        {results ? (
          <Results
            results={results}
            onReset={() => {
              setResults(null);
              setLoading(false);
            }}
          />
        ) : (
          <AssessmentForm
            onComplete={setResults}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </main>
      <footer className="site-footer">
        <span>PrepPulse · {new Date().getFullYear()}</span>
        <span>Preparation guidance, not a prediction of hiring outcomes.</span>
      </footer>
    </div>
  );
}
