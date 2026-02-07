import React, { useState } from 'react';
import AssessmentForm from './components/AssessmentForm';
import Results from './components/Results';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssessmentComplete = (assessmentResults) => {
    setResults(assessmentResults);
  };

  const handleReset = () => {
    setResults(null);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🎯 AI PrepPulse</h1>
          <p className="tagline">Measure Your Interview Readiness in Under 2 Minutes</p>
        </div>
      </header>

      <main className="app-main">
        {!results ? (
          <AssessmentForm 
            onComplete={handleAssessmentComplete}
            loading={loading}
            setLoading={setLoading}
          />
        ) : (
          <Results 
            results={results}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 AI PrepPulse | Powered by Google Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;
