import React, { useState } from 'react';
import axios from 'axios';
import './AssessmentForm.css';

function AssessmentForm({ onComplete, loading, setLoading }) {
  const [formData, setFormData] = useState({
    targetRole: '',
    education: '',
    yearsOfExperience: '',
    technicalSkills: '',
    projectsCompleted: '',
    communicationConfidence: 5,
    linkedinUrl: '',
    portfolioUrl: '',
    githubUrl: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!['application/pdf', 'text/plain'].includes(file.type)) {
        setError('Only PDF and TXT files are supported');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const submissionTime = ((Date.now() - startTime) / 1000).toFixed(1);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append resume file if provided
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }

      const response = await axios.post('/api/assessment/analyze', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onComplete({
        ...response.data,
        userInputTime: `${submissionTime}s`
      });
    } catch (err) {
      console.error('Assessment error:', err);
      setError(err.response?.data?.message || 'Failed to analyze profile. Please try again.');
      setLoading(false);
    }
  };

  // Track when user starts filling the form
  const handleFirstInteraction = () => {
    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  return (
    <div className="assessment-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>📋 Quick Assessment Form</h2>
          <p>Complete this form in under 2 minutes to get your readiness score</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} onFocus={handleFirstInteraction}>
          <div className="form-section">
            <h3>🎯 Career Goals</h3>
            
            <div className="form-group">
              <label htmlFor="targetRole">Target Role *</label>
              <input
                type="text"
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer, Data Analyst"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="education">Education Level *</label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your education</option>
                <option value="High School">High School</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Bootcamp/Certification">Bootcamp/Certification</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>💼 Experience</h3>
            
            <div className="form-group">
              <label htmlFor="yearsOfExperience">Years of Experience</label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                max="50"
                step="0.5"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectsCompleted">Projects Completed</label>
              <input
                type="number"
                id="projectsCompleted"
                name="projectsCompleted"
                value={formData.projectsCompleted}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>🛠️ Technical Skills</h3>
            
            <div className="form-group">
              <label htmlFor="technicalSkills">Technical Skills (comma-separated)</label>
              <textarea
                id="technicalSkills"
                name="technicalSkills"
                value={formData.technicalSkills}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript, React, Node.js, Python, SQL"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>💬 Communication</h3>
            
            <div className="form-group">
              <label htmlFor="communicationConfidence">
                Communication Confidence: {formData.communicationConfidence}/10
              </label>
              <input
                type="range"
                id="communicationConfidence"
                name="communicationConfidence"
                value={formData.communicationConfidence}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="slider"
              />
              <div className="slider-labels">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>🌐 Online Presence</h3>
            
            <div className="form-group">
              <label htmlFor="linkedinUrl">LinkedIn Profile URL</label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="form-group">
              <label htmlFor="githubUrl">GitHub Profile URL</label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolioUrl">Portfolio Website URL</label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>📄 Resume Upload</h3>
            
            <div className="form-group">
              <label htmlFor="resume">Upload Resume (Optional - PDF or TXT, max 5MB)</label>
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="file-input"
              />
              {resumeFile && (
                <div className="file-selected">
                  ✓ {resumeFile.name} selected
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '⏳ Analyzing Your Profile...' : '🚀 Get My Readiness Score'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssessmentForm;
