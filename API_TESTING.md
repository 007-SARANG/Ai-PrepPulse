# API Testing Guide for AI PrepPulse

This document helps you test the API endpoints using tools like Postman, curl, or browser.

## 🔍 Base URL

**Local Development:**
```
http://localhost:5000
```

**Production:**
```
https://your-backend-url.onrender.com
```

---

## 📡 API Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the API server is running

**Request:**
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "AI PrepPulse API is running"
}
```

---

### 2. Analyze Profile (Main Endpoint)

**Endpoint:** `POST /api/assessment/analyze`

**Description:** Analyze user profile and return interview readiness score

**Content-Type:** `multipart/form-data`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| targetRole | string | Yes | Target job role |
| education | string | Yes | Education level |
| yearsOfExperience | number | No | Years of experience |
| technicalSkills | string | No | Comma-separated skills |
| projectsCompleted | number | No | Number of projects |
| communicationConfidence | number | No | 1-10 rating |
| linkedinUrl | string | No | LinkedIn profile URL |
| githubUrl | string | No | GitHub profile URL |
| portfolioUrl | string | No | Portfolio website URL |
| resume | file | No | PDF or TXT file (max 5MB) |

---

## 🧪 Test with cURL

### Basic Request (No Resume)

```bash
curl -X POST http://localhost:5000/api/assessment/analyze \
  -F "targetRole=Software Engineer" \
  -F "education=Bachelor's Degree" \
  -F "yearsOfExperience=2" \
  -F "technicalSkills=JavaScript, React, Node.js, Python" \
  -F "projectsCompleted=5" \
  -F "communicationConfidence=7" \
  -F "linkedinUrl=https://linkedin.com/in/johndoe" \
  -F "githubUrl=https://github.com/johndoe" \
  -F "portfolioUrl=https://johndoe.dev"
```

### With Resume Upload

```bash
curl -X POST http://localhost:5000/api/assessment/analyze \
  -F "targetRole=Data Analyst" \
  -F "education=Master's Degree" \
  -F "yearsOfExperience=3" \
  -F "technicalSkills=Python, SQL, Tableau, Excel" \
  -F "projectsCompleted=8" \
  -F "communicationConfidence=8" \
  -F "resume=@/path/to/your/resume.pdf"
```

---

## 🎯 Test with Postman

### Setup:

1. **Create New Request**
   - Method: POST
   - URL: `http://localhost:5000/api/assessment/analyze`

2. **Body Tab**
   - Select: form-data
   - Add key-value pairs:

| Key | Value | Type |
|-----|-------|------|
| targetRole | Software Engineer | Text |
| education | Bachelor's Degree | Text |
| yearsOfExperience | 2 | Text |
| technicalSkills | JavaScript, React, Node.js | Text |
| projectsCompleted | 5 | Text |
| communicationConfidence | 7 | Text |
| linkedinUrl | https://linkedin.com/in/test | Text |
| githubUrl | https://github.com/test | Text |
| portfolioUrl | https://test.dev | Text |
| resume | [Select File] | File |

3. **Send Request**

---

## ✅ Expected Response

```json
{
  "success": true,
  "processingTime": "3.45s",
  "overallScore": 68,
  "readinessLevel": "Advanced",
  "breakdown": {
    "technicalSkills": 70,
    "resumeQuality": 65,
    "communication": 70,
    "portfolio": 85
  },
  "strengths": [
    "Strong technical foundation with modern tech stack",
    "Good online presence across platforms",
    "Clear career progression and goals"
  ],
  "gaps": [
    "Resume could include more quantifiable achievements",
    "Limited project portfolio - aim for 8-10 substantial projects",
    "Communication skills can be enhanced through mock interviews"
  ],
  "actionableSteps": [
    "Update resume with STAR method achievements",
    "Build 2-3 more portfolio projects showcasing full-stack skills",
    "Complete LinkedIn profile to 100% (add recommendations)",
    "Practice 50+ LeetCode problems for technical interviews",
    "Join Toastmasters or similar group to improve communication"
  ],
  "timelineEstimate": "3-4 weeks",
  "keyRecommendation": "Focus on building 2-3 substantial projects that demonstrate your full-stack capabilities, and ensure your GitHub profile showcases clean, well-documented code."
}
```

---

## 🐛 Error Responses

### 400 Bad Request - Missing Required Fields

```json
{
  "error": "Missing required fields: targetRole and education are required"
}
```

### 500 Internal Server Error - API Failure

```json
{
  "error": "Failed to analyze profile",
  "message": "Gemini API error: Invalid API key"
}
```

### 413 Payload Too Large - File Size Exceeded

```json
{
  "error": "File size limit exceeded (5MB max)"
}
```

---

## 🧪 Sample Test Scenarios

### Test 1: Fresh Graduate (Low Experience)

```bash
curl -X POST http://localhost:5000/api/assessment/analyze \
  -F "targetRole=Junior Developer" \
  -F "education=Bachelor's Degree" \
  -F "yearsOfExperience=0" \
  -F "technicalSkills=HTML, CSS, JavaScript" \
  -F "projectsCompleted=2" \
  -F "communicationConfidence=5"
```

**Expected Score:** 30-45 (Beginner/Intermediate)

---

### Test 2: Mid-Level Professional

```bash
curl -X POST http://localhost:5000/api/assessment/analyze \
  -F "targetRole=Senior Software Engineer" \
  -F "education=Master's Degree" \
  -F "yearsOfExperience=5" \
  -F "technicalSkills=JavaScript, TypeScript, React, Node.js, AWS, Docker, Kubernetes" \
  -F "projectsCompleted=15" \
  -F "communicationConfidence=8" \
  -F "linkedinUrl=https://linkedin.com/in/senior" \
  -F "githubUrl=https://github.com/senior" \
  -F "portfolioUrl=https://senior.dev"
```

**Expected Score:** 75-85 (Expert)

---

### Test 3: Career Switcher

```bash
curl -X POST http://localhost:5000/api/assessment/analyze \
  -F "targetRole=Full Stack Developer" \
  -F "education=Bootcamp/Certification" \
  -F "yearsOfExperience=0.5" \
  -F "technicalSkills=Python, Django, React" \
  -F "projectsCompleted=3" \
  -F "communicationConfidence=6" \
  -F "githubUrl=https://github.com/switcher"
```

**Expected Score:** 45-55 (Intermediate)

---

## 📊 Performance Benchmarks

**Target Performance:**
- API Response Time: < 10 seconds
- User Input Time: < 2 minutes
- Total Assessment Time: < 3 minutes

**Monitoring:**
```bash
# Test response time
time curl -X POST http://localhost:5000/api/assessment/analyze \
  -F "targetRole=Developer" \
  -F "education=Bachelor's Degree"
```

---

## 🔐 Security Testing

### Test File Upload Limits

```bash
# Create a large file (>5MB)
dd if=/dev/zero of=large.pdf bs=1M count=6

# Try uploading (should fail)
curl -X POST http://localhost:5000/api/assessment/analyze \
  -F "targetRole=Developer" \
  -F "education=Bachelor's" \
  -F "resume=@large.pdf"
```

**Expected:** Error 413 or message about file size

### Test Invalid File Types

```bash
# Try uploading unsupported file
curl -X POST http://localhost:5000/api/assessment/analyze \
  -F "targetRole=Developer" \
  -F "education=Bachelor's" \
  -F "resume=@image.jpg"
```

**Expected:** Error about unsupported file format

---

## 🛠️ Debugging Tips

### Enable Verbose Logging

In `backend/server.js`, add:

```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Check Request Body

In `backend/routes/assessment.js`:

```javascript
console.log('Received data:', req.body);
console.log('Received files:', req.files);
```

### Monitor API Calls

Use Postman's console to see:
- Request headers
- Response time
- Response size
- Status codes

---

## ✅ Testing Checklist

Before deployment, verify:

- [ ] Health endpoint returns 200 OK
- [ ] Analysis works without resume
- [ ] Analysis works with PDF resume
- [ ] Analysis works with TXT resume
- [ ] File size validation works (reject >5MB)
- [ ] Missing required fields return 400 error
- [ ] Invalid API key returns appropriate error
- [ ] Response time is under 10 seconds
- [ ] All fields in response are populated
- [ ] Scores are in valid range (0-100)
- [ ] CORS headers are set correctly

---

## 📞 Troubleshooting

**Issue:** "ECONNREFUSED" Error
- **Solution:** Backend server not running. Start with `npm start`

**Issue:** Timeout Error
- **Solution:** Gemini AI taking too long. Check API key and internet connection

**Issue:** 404 Not Found
- **Solution:** Check endpoint URL spelling and method (POST not GET)

**Issue:** CORS Error
- **Solution:** Add your frontend URL to CORS whitelist in server.js

---

Happy Testing! 🚀
