const express = require('express');
const router = express.Router();
const { analyzeProfile } = require('../services/geminiService');
const { extractResumeText } = require('../utils/resumeParser');

router.post('/analyze', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Extract form data
    const {
      yearsOfExperience,
      technicalSkills,
      projectsCompleted,
      education,
      targetRole,
      communicationConfidence,
      linkedinUrl,
      portfolioUrl,
      githubUrl
    } = req.body;

    // Validate required fields
    if (!targetRole || !education) {
      return res.status(400).json({ 
        error: 'Missing required fields: targetRole and education are required' 
      });
    }

    // Extract resume text if provided
    let resumeText = '';
    if (req.files && req.files.resume) {
      try {
        resumeText = await extractResumeText(req.files.resume);
      } catch (error) {
        console.error('Resume parsing error:', error);
        // Continue without resume if parsing fails
      }
    }

    // Prepare profile data
    const profileData = {
      yearsOfExperience: parseFloat(yearsOfExperience) || 0,
      technicalSkills: technicalSkills || '',
      projectsCompleted: parseInt(projectsCompleted) || 0,
      education: education || '',
      targetRole: targetRole || '',
      communicationConfidence: parseInt(communicationConfidence) || 5,
      linkedinUrl: linkedinUrl || '',
      portfolioUrl: portfolioUrl || '',
      githubUrl: githubUrl || '',
      resumeText: resumeText
    };

    // Get AI analysis
    const analysis = await analyzeProfile(profileData);
    
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    res.json({
      success: true,
      processingTime: `${processingTime}s`,
      ...analysis
    });

  } catch (error) {
    console.error('Assessment analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze profile',
      message: error.message 
    });
  }
});

module.exports = router;
