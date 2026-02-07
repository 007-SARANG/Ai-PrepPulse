# 🎯 AI PrepPulse - Quick Start Guide

Get up and running in 5 minutes!

## 📋 Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ npm installed (comes with Node.js)
- ✅ Google Gemini API key ([Get it free](https://makersuite.google.com/app/apikey))

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Dependencies

Open terminal in project root and run:

```bash
npm run install-all
```

This will install all dependencies for both backend and frontend.

### Step 2: Setup Environment Variables

Navigate to backend folder and create `.env` file:

```bash
cd backend
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux
```

Open `backend/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

**Get your API key**: 
1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into .env file

### Step 3: Start Backend Server

```bash
# From project root
npm run start-backend

# OR from backend folder
cd backend
npm start
```

You should see: `Server running on port 5000`

### Step 4: Start Frontend (New Terminal)

Open a **new terminal** and run:

```bash
# From project root
npm run start-frontend

# OR from frontend folder
cd frontend
npm start
```

Browser will automatically open at `http://localhost:3000`

### Step 5: Test the Application

1. Fill out the assessment form
2. Upload a sample resume (optional)
3. Click "Get My Readiness Score"
4. View your results!

## 🎉 You're All Set!

The application is now running:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/health

## 🛠️ Alternative: Run Both Simultaneously

If you have `concurrently` installed:

```bash
# From project root
npm run dev
```

This starts both backend and frontend in one command!

## 📝 Sample Test Data

Use this to quickly test the application:

```
Target Role: Software Engineer
Education: Bachelor's Degree
Years of Experience: 2
Technical Skills: JavaScript, React, Node.js, Python, SQL, Git
Projects Completed: 5
Communication Confidence: 7/10
LinkedIn: https://linkedin.com/in/johndoe
GitHub: https://github.com/johndoe
Portfolio: https://johndoe.dev
```

## ❗ Common Issues

### Issue 1: Port 5000 Already in Use

**Solution**: Change port in `backend/.env`
```env
PORT=5001
```

### Issue 2: "Cannot find module" Error

**Solution**: Reinstall dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Issue 3: API Key Error

**Solution**: 
- Verify API key has no extra spaces
- Ensure .env file is in `backend/` folder
- Restart backend server after adding key

### Issue 4: Frontend Won't Start

**Solution**: Clear npm cache
```bash
cd frontend
npm cache clean --force
npm install
npm start
```

## 📺 Next Steps

1. ✅ Record a demo video of your working application
2. ✅ Add video link to README.md
3. ✅ Push to GitHub (make it public)
4. ✅ Deploy to production (see DEPLOYMENT.md)
5. ✅ Submit your repository link

## 🆘 Need Help?

- Check the full README.md for detailed documentation
- Review DEPLOYMENT.md for hosting instructions
- Open an issue on GitHub

## 🎊 Happy Coding!

You now have a fully functional AI-powered interview readiness assessment tool!
