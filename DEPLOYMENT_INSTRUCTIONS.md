# 🚀 Simple Deployment Instructions

## For Your Friend (The Teacher)

### Step 1: Deploy Backend (5 minutes)

1. **Go to**: https://vercel.com
2. **Click**: "Sign up with GitHub" (create free account)
3. **Click**: "New Project"
4. **Import**: Click "Import Git Repository"
5. **Select**: Your GitHub repository
6. **Set Root Directory**: `backend`
7. **Click**: "Deploy"
8. **Copy the URL**: It will look like `https://your-project.vercel.app`

### Step 2: Update Chrome Extension

1. **Open**: `chrome-extension/background.js`
2. **Replace**: `https://your-backend-url.vercel.app` with your actual URL
3. **Open**: `chrome-extension/sidepanel.js`
4. **Replace**: `https://your-backend-url.vercel.app` with your actual URL

### Step 3: Deploy Teacher Dashboard (5 minutes)

1. **Go to**: https://vercel.com
2. **Click**: "New Project"
3. **Import**: Your GitHub repository again
4. **Set Root Directory**: `teacher-dashboard`
5. **Click**: "Deploy"
6. **Copy the URL**: It will look like `https://your-dashboard.vercel.app`

### Step 4: Update Dashboard

1. **Open**: `teacher-dashboard/package.json`
2. **Replace**: `https://your-backend-url.vercel.app` with your backend URL
3. **Redeploy**: Go back to Vercel and click "Redeploy"

### Step 5: Distribute Chrome Extension

1. **Zip the chrome-extension folder**
2. **Send to students** or upload to Google Drive
3. **Students install**: Chrome → Extensions → Load unpacked → Select folder

## 🎯 What Your Friend Gets

- **Backend URL**: `https://your-backend.vercel.app`
- **Dashboard URL**: `https://your-dashboard.vercel.app`
- **No localhost needed** - everything runs in the cloud
- **Free hosting** - no costs
- **Automatic updates** when you push to GitHub

## 📱 For Students

1. **Download** the chrome-extension folder
2. **Open Chrome** → Extensions → Developer mode
3. **Click** "Load unpacked" → Select the folder
4. **Done!** Extension automatically tracks activity

## 🔧 Troubleshooting

- **If URLs don't work**: Make sure you replaced all placeholder URLs
- **If extension doesn't load**: Check that all files are in the folder
- **If dashboard shows errors**: Check that backend URL is correct

## 💡 Pro Tips

- **Bookmark the dashboard URL** for easy access
- **Test with a few students first** before full deployment
- **The system works offline** - data syncs when connection returns 