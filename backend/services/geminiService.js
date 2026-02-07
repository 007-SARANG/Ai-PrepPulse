const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeProfile(profileData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert career counselor and interview preparation specialist. Analyze this candidate's profile and provide a comprehensive interview readiness assessment.

CANDIDATE PROFILE:
- Target Role: ${profileData.targetRole}
- Education: ${profileData.education}
- Years of Experience: ${profileData.yearsOfExperience}
- Technical Skills: ${profileData.technicalSkills}
- Projects Completed: ${profileData.projectsCompleted}
- Communication Confidence (1-10): ${profileData.communicationConfidence}
- LinkedIn: ${profileData.linkedinUrl || 'Not provided'}
- Portfolio: ${profileData.portfolioUrl || 'Not provided'}
- GitHub: ${profileData.githubUrl || 'Not provided'}
${profileData.resumeText ? `\n- Resume Content:\n${profileData.resumeText.substring(0, 2000)}` : ''}

INSTRUCTIONS:
Provide a JSON response with the following structure (respond ONLY with valid JSON, no markdown formatting):

{
  "overallScore": <number between 0-100>,
  "readinessLevel": "<Beginner|Intermediate|Advanced|Expert>",
  "breakdown": {
    "technicalSkills": <score 0-100>,
    "resumeQuality": <score 0-100>,
    "communication": <score 0-100>,
    "portfolio": <score 0-100>
  },
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>",
    "<specific strength 3>"
  ],
  "gaps": [
    "<specific gap 1 with clear explanation>",
    "<specific gap 2 with clear explanation>",
    "<specific gap 3 with clear explanation>"
  ],
  "actionableSteps": [
    "<specific action item 1>",
    "<specific action item 2>",
    "<specific action item 3>",
    "<specific action item 4>",
    "<specific action item 5>"
  ],
  "timelineEstimate": "<realistic timeline like '2-3 weeks', '1-2 months', etc>",
  "keyRecommendation": "<single most important advice in 1-2 sentences>"
}

SCORING CRITERIA:
- Technical Skills: Evaluate depth, relevance to target role, and breadth
- Resume Quality: Assess clarity, achievements, keywords, formatting (based on provided info)
- Communication: Based on self-assessment and profile completeness
- Portfolio: Evaluate online presence (LinkedIn, GitHub, portfolio)

Be honest, specific, and actionable. Focus on what matters for landing interviews in their target role.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON response
    const analysis = JSON.parse(text);
    
    // Validate the response structure
    if (!analysis.overallScore || !analysis.readinessLevel || !analysis.breakdown) {
      throw new Error('Invalid response structure from AI');
    }
    
    return analysis;
    
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Return a fallback response if AI fails
    return generateFallbackAnalysis(profileData);
  }
}

function generateFallbackAnalysis(profileData) {
  // Rule-based fallback scoring
  let technicalScore = Math.min(100, 
    (profileData.technicalSkills.split(',').length * 10) +
    (profileData.projectsCompleted * 5) +
    (profileData.yearsOfExperience * 10)
  );
  
  let resumeScore = 50;
  if (profileData.resumeText) resumeScore += 30;
  if (profileData.linkedinUrl) resumeScore += 10;
  if (profileData.portfolioUrl) resumeScore += 10;
  
  let communicationScore = profileData.communicationConfidence * 10;
  
  let portfolioScore = 0;
  if (profileData.githubUrl) portfolioScore += 35;
  if (profileData.portfolioUrl) portfolioScore += 35;
  if (profileData.linkedinUrl) portfolioScore += 30;
  
  const overallScore = Math.round(
    (technicalScore * 0.3) + 
    (resumeScore * 0.25) + 
    (communicationScore * 0.25) + 
    (portfolioScore * 0.2)
  );
  
  let readinessLevel = 'Beginner';
  if (overallScore >= 75) readinessLevel = 'Expert';
  else if (overallScore >= 60) readinessLevel = 'Advanced';
  else if (overallScore >= 40) readinessLevel = 'Intermediate';
  
  return {
    overallScore,
    readinessLevel,
    breakdown: {
      technicalSkills: Math.round(technicalScore),
      resumeQuality: Math.round(resumeScore),
      communication: Math.round(communicationScore),
      portfolio: Math.round(portfolioScore)
    },
    strengths: [
      profileData.yearsOfExperience > 1 ? 'Relevant work experience' : 'Educational background',
      profileData.projectsCompleted > 3 ? 'Strong project portfolio' : 'Willingness to learn',
      'Clear career goals'
    ],
    gaps: [
      portfolioScore < 50 ? 'Limited online presence - need LinkedIn/GitHub profile' : 'Could strengthen online brand',
      technicalScore < 60 ? 'Technical skills need more depth for target role' : 'Some technical skills could be enhanced',
      !profileData.resumeText ? 'Resume not provided for detailed analysis' : 'Resume could be optimized further'
    ],
    actionableSteps: [
      'Update resume with quantifiable achievements and keywords',
      'Build/enhance GitHub profile with 3-5 quality projects',
      'Create or improve LinkedIn profile (complete to 100%)',
      'Practice technical interview questions on LeetCode/HackerRank',
      'Prepare STAR method answers for behavioral questions'
    ],
    timelineEstimate: overallScore >= 60 ? '2-3 weeks' : '1-2 months',
    keyRecommendation: 'Focus on building practical projects and creating a strong online presence to stand out to recruiters.'
  };
}

module.exports = { analyzeProfile };
