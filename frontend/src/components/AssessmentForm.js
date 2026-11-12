import React, { useRef, useState } from "react";
import axios from "axios";
import { isValidAnalysis } from "../validateAnalysis";

const INITIAL = {
  targetRole: "",
  education: "",
  yearsOfExperience: "",
  technicalSkills: "",
  projectsCompleted: "",
  communicationConfidence: 5,
  linkedinUrl: "",
  portfolioUrl: "",
  githubUrl: "",
};
export default function AssessmentForm({ onComplete, loading, setLoading }) {
  const [formData, setFormData] = useState(INITIAL);
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const startTime = useRef(null);
  const change = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const removeFile = () => {
    setResumeFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const selectFile = (e) => {
    const file = e.target.files?.[0];
    setResumeFile(null);
    setError("");
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("Your resume is too large. Choose a file under 4 MB.");
      e.target.value = "";
      return;
    }
    if (
      !["application/pdf", "text/plain"].includes(file.type) ||
      !/\.(pdf|txt)$/i.test(file.name)
    ) {
      setError("Choose a PDF or TXT resume.");
      e.target.value = "";
      return;
    }
    setResumeFile(file);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value),
      );
      if (resumeFile) payload.append("resume", resumeFile);
      const response = await axios.post("/api/assessment/analyze", payload, {
        timeout: 25000,
      });
      if (!isValidAnalysis(response.data))
        throw new Error(
          "The assessment returned an incomplete report. Please try again.",
        );
      onComplete({
        ...response.data,
        targetRole: formData.targetRole,
        userInputTime: `${((Date.now() - (startTime.current || Date.now())) / 1000).toFixed(1)}s`,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "We could not generate your report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="assessment-layout">
      <aside className="intro">
        <div className="intro-status">
          <span />
          Your next chapter starts here
        </div>
        <h1 id="view-title" tabIndex="-1">
          Prepare with a <em>clearer plan.</em>
        </h1>
        <p className="intro-description">
          Turn your experience, skills, and goals into a focused interview
          preparation plan.
        </p>
        <ol className="journey-list">
          <li>
            <span>01</span>
            <div>
              <strong>Share your background</strong>
              <p>A quick snapshot of where you are.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>See the bigger picture</strong>
              <p>Understand your strengths and gaps.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Know your next move</strong>
              <p>Leave with practical steps to work on.</p>
            </div>
          </li>
        </ol>
        <p className="intro-footnote">
          Only your role and education are required. Add more context for more
          useful feedback.
        </p>
      </aside>
      <div className="form-panel">
        <div className="panel-heading">
          <h2>Your starting point</h2>
          <p>Tell us a little about yourself.</p>
        </div>
        <form
          onSubmit={submit}
          onFocus={() => {
            if (!startTime.current) startTime.current = Date.now();
          }}
          aria-busy={loading}
        >
          <fieldset disabled={loading}>
            <legend className="sr-only">Assessment profile</legend>
            <section
              className="form-section"
              aria-labelledby="background-title"
            >
              <div className="section-title">
                <h3 id="background-title">Background</h3>
                <span>01 / 03</span>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="targetRole">
                    Target role <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="targetRole"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={change}
                    placeholder="e.g. Machine Learning Engineer"
                    required
                    maxLength="150"
                    autoComplete="organization-title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="education">
                    Education <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={change}
                    required
                  >
                    <option value="">Select your education</option>
                    {[
                      "High School",
                      "Bachelor's Degree",
                      "Master's Degree",
                      "PhD",
                      "Bootcamp/Certification",
                    ].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="yearsOfExperience">Years of experience</label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={change}
                    min="0"
                    max="50"
                    step="0.5"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="projectsCompleted">Projects completed</label>
                  <input
                    type="number"
                    id="projectsCompleted"
                    name="projectsCompleted"
                    value={formData.projectsCompleted}
                    onChange={change}
                    min="0"
                    step="1"
                    placeholder="0"
                  />
                </div>
              </div>
            </section>
            <section className="form-section" aria-labelledby="skills-title">
              <div className="section-title">
                <h3 id="skills-title">Skills & confidence</h3>
                <span>02 / 03</span>
              </div>
              <div className="form-group">
                <label htmlFor="technicalSkills">Technical skills</label>
                <textarea
                  id="technicalSkills"
                  name="technicalSkills"
                  value={formData.technicalSkills}
                  onChange={change}
                  placeholder="Python, SQL, React…"
                  rows="3"
                  maxLength="3000"
                  aria-describedby="skills-help"
                />
                <p id="skills-help" className="field-hint">
                  Separate skills with commas.
                </p>
              </div>
              <div className="form-group confidence-group">
                <div className="range-label">
                  <label htmlFor="communicationConfidence">
                    Communication confidence
                  </label>
                  <output htmlFor="communicationConfidence">
                    {formData.communicationConfidence}
                    <span> / 10</span>
                  </output>
                </div>
                <input
                  type="range"
                  id="communicationConfidence"
                  name="communicationConfidence"
                  min="1"
                  max="10"
                  value={formData.communicationConfidence}
                  onChange={change}
                />
                <div className="range-ends">
                  <span>Finding my voice</span>
                  <span>Feeling confident</span>
                </div>
              </div>
            </section>
            <section className="form-section" aria-labelledby="context-title">
              <div className="section-title">
                <h3 id="context-title">A little more context</h3>
                <span>03 / 03 · Optional</span>
              </div>
              <div className="form-group">
                <label htmlFor="resume">Attach your resume</label>
                <input
                  ref={fileRef}
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.txt"
                  onChange={selectFile}
                  aria-describedby="resume-help"
                />
                <p id="resume-help" className="field-hint">
                  PDF or TXT, up to 4 MB. The resume text is included in the
                  analysis.
                </p>
                {resumeFile && (
                  <div className="selected-file">
                    <span>{resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Remove resume"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <details className="profile-links">
                <summary>
                  Add profile links <span>LinkedIn, GitHub, portfolio</span>
                </summary>
                <div className="profile-link-fields">
                  {[
                    [
                      "linkedinUrl",
                      "LinkedIn profile",
                      "https://linkedin.com/in/you",
                    ],
                    ["githubUrl", "GitHub profile", "https://github.com/you"],
                    [
                      "portfolioUrl",
                      "Portfolio website",
                      "https://your-site.com",
                    ],
                  ].map(([name, label, placeholder]) => (
                    <div className="form-group" key={name}>
                      <label htmlFor={name}>{label}</label>
                      <input
                        type="url"
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={change}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </details>
            </section>
          </fieldset>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          {loading && (
            <p
              className="analysis-status"
              role="status"
              aria-label="Analysis progress"
            >
              Analyzing your profile and putting your report together…
            </p>
          )}
          <div className="form-submit">
            <button
              type="submit"
              className="button button-primary"
              disabled={loading}
            >
              {loading ? "Analyzing your profile…" : "Generate my report"}
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M4 12h15m-6-6 6 6-6 6" />
              </svg>
            </button>
            <p>A preparation snapshot, not a hiring decision.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
