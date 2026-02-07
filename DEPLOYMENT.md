# 🚀 Deployment Guide - AI PrepPulse

This guide will help you deploy AI PrepPulse to production using free hosting services.

## 📋 Pre-Deployment Checklist

- [ ] Test application locally (both frontend and backend)
- [ ] Get Google Gemini API key
- [ ] Create GitHub repository and push code
- [ ] Verify all environment variables are set
- [ ] Test with different input scenarios
- [ ] Record demo video

---

## 🎯 Option 1: Deploy Backend to Render.com (Recommended)

**Render.com offers free hosting for web services with generous limits.**

### Steps:

1. **Sign Up/Login** to [Render.com](https://render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository

3. **Configure Service**
   ```
   Name: ai-preppulse-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add:
     ```
     GEMINI_API_KEY = your_actual_api_key
     NODE_ENV = production
     PORT = 10000 (Render uses this)
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (~3-5 minutes)
   - Copy your service URL: `https://ai-preppulse-backend.onrender.com`

6. **Update Backend for Production**
   - Add CORS configuration in server.js:
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'],
     credentials: true
   }));
   ```

### Important Notes:
- Free tier sleeps after 15 min of inactivity (first request may be slow)
- Upgrade to paid plan ($7/month) to avoid sleep
- Check logs in Render dashboard for debugging

---

## 🎯 Option 2: Deploy Frontend to Vercel (Recommended)

**Vercel is perfect for React apps with automatic deployments.**

### Steps:

1. **Sign Up/Login** to [Vercel.com](https://vercel.com)

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select your repo

3. **Configure Project**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add (if you want to use custom backend URL):
     ```
     REACT_APP_API_URL = https://ai-preppulse-backend.onrender.com
     ```

5. **Update Frontend Code** (frontend/src/components/AssessmentForm.js)
   ```javascript
   // Replace axios.post('/api/assessment/analyze', ...) with:
   const API_URL = process.env.REACT_APP_API_URL || '';
   const response = await axios.post(`${API_URL}/api/assessment/analyze`, formDataToSend, {
     headers: {
       'Content-Type': 'multipart/form-data',
     },
   });
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment (~2-3 minutes)
   - Your site will be live at: `https://ai-preppulse.vercel.app`

7. **Auto-Deploy on Push**
   - Every push to `main` branch auto-deploys
   - Preview deployments for PRs

---

## 🎯 Option 3: Deploy Backend to Railway.app

**Railway is another excellent free option with easy setup.**

### Steps:

1. **Sign Up** at [Railway.app](https://railway.app)

2. **New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**
   - Click "Variables" tab
   - Add:
     ```
     GEMINI_API_KEY = your_api_key
     NODE_ENV = production
     PORT = $PORT (Railway provides this)
     ```

5. **Generate Domain**
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy URL: `https://ai-preppulse-backend.up.railway.app`

---

## 🎯 Option 4: Deploy Frontend to Netlify

**Netlify is another great alternative to Vercel.**

### Steps:

1. **Sign Up** at [Netlify.com](https://netlify.com)

2. **New Site from Git**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select repo

3. **Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/build
   ```

4. **Environment Variables** (if needed)
   - Site settings → Environment variables
   - Add `REACT_APP_API_URL`

5. **Deploy**
   - Click "Deploy site"
   - Site live at: `https://ai-preppulse.netlify.app`

---

## 🎯 Option 5: Single Server Deployment (VPS)

**If you have a VPS (DigitalOcean, AWS EC2, Linode), deploy both together.**

### Steps:

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve Frontend from Backend**
   - Update backend/server.js:
   ```javascript
   const path = require('path');
   
   // Serve static files from React build
   app.use(express.static(path.join(__dirname, '../frontend/build')));
   
   // Handle React routing, return all requests to React app
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
   });
   ```

3. **Deploy to Server**
   ```bash
   # SSH into your server
   ssh user@your-server-ip
   
   # Clone repo
   git clone https://github.com/yourusername/ai-preppulse.git
   cd ai-preppulse
   
   # Install dependencies
   cd backend && npm install
   cd ../frontend && npm install && npm run build
   
   # Set environment variables
   cd ../backend
   nano .env  # Add your GEMINI_API_KEY
   
   # Install PM2 for process management
   npm install -g pm2
   
   # Start server
   pm2 start server.js --name ai-preppulse
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx (Optional)**
   - Install nginx
   - Configure reverse proxy
   - Setup SSL with Let's Encrypt

---

## 🛡️ Security Checklist for Production

- [ ] Never expose API keys in frontend code
- [ ] Use HTTPS only (no HTTP)
- [ ] Set up proper CORS configuration
- [ ] Add rate limiting to prevent abuse
- [ ] Validate and sanitize all inputs
- [ ] Set file upload size limits
- [ ] Use environment variables for all secrets
- [ ] Enable security headers
- [ ] Monitor error logs regularly
- [ ] Set up backup for important data

---

## 📊 Post-Deployment Testing

### Test Checklist:

1. **Basic Functionality**
   - [ ] Form loads correctly
   - [ ] All fields are editable
   - [ ] File upload works
   - [ ] Submit button triggers analysis
   - [ ] Results display properly

2. **API Testing**
   - [ ] Backend health check: `https://your-backend-url/health`
   - [ ] Test with various inputs
   - [ ] Test with and without resume
   - [ ] Test error handling

3. **Performance**
   - [ ] Page loads under 3 seconds
   - [ ] API responds under 10 seconds
   - [ ] Images and assets load properly
   - [ ] Mobile responsive design works

4. **Browser Compatibility**
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari
   - [ ] Mobile browsers

---

## 🐛 Common Deployment Issues

### Issue: CORS Error
**Solution**: Update backend CORS configuration to include your frontend domain

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'http://localhost:3000'
  ]
}));
```

### Issue: API Key Not Working
**Solution**: 
- Verify environment variable is set correctly
- No extra spaces or quotes
- Restart service after adding env vars

### Issue: 404 on Page Refresh (React Router)
**Solution**: Configure server to serve index.html for all routes
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
```

### Issue: Slow Cold Starts (Render/Railway)
**Solution**: 
- Upgrade to paid plan to prevent sleep
- Or ping your backend every 10 minutes to keep it awake

---

## 📈 Monitoring & Analytics

### Recommended Tools:

1. **Uptime Monitoring**: UptimeRobot (free)
2. **Error Tracking**: Sentry (free tier)
3. **Analytics**: Google Analytics
4. **Performance**: Lighthouse CI

---

## 🎉 Deployment Complete!

After successful deployment:

1. ✅ Test all functionality
2. ✅ Record demo video showing live site
3. ✅ Update README with live URLs
4. ✅ Submit GitHub repo link
5. ✅ Share with friends for testing

**Your Live URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.onrender.com`

---

## 📞 Need Help?

If you face issues:
- Check service logs (Render/Vercel dashboard)
- Review environment variables
- Test API endpoints with Postman
- Check browser console for errors

Good luck with your deployment! 🚀
