# Student Browser Monitoring Chrome Extension

A Chrome extension that helps teachers monitor students' browsing activity on Chromebooks, with a focus on detecting visits to game sites and tracking browser history.

## 🎯 What This Does

- **For Students**: Automatically tracks browsing activity and reports it to the teacher
- **For Teachers**: Provides a dashboard to monitor all students' browsing history and get alerts when students visit game sites
- **Privacy**: Only tracks browsing data, no personal information is collected

## 📁 Project Structure

```
school/
├── chrome-extension/          # Chrome extension files
│   ├── manifest.json         # Extension configuration
│   ├── background.js         # Tracks browsing activity
│   ├── side-panel.html      # Student info input form
│   ├── side-panel.js        # Handles student form
│   └── icons/               # Extension icons
├── backend/                  # Node.js server
│   ├── server.js            # Express server
│   ├── package.json         # Dependencies
│   └── .env                # Environment variables
└── dashboard/               # React teacher dashboard
    ├── src/
    ├── package.json
    └── public/
```

## 🚀 Quick Start

### 1. Set Up the Backend

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:3001`

### 2. Set Up the Dashboard

```bash
cd dashboard
npm install
npm start
```

The dashboard will run on `http://localhost:3000`

### 3. Install the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The extension will appear in your extensions list

### 4. Configure Student Information

1. Click the extension icon in Chrome
2. Click "Open side panel"
3. Enter your:
   - Name
   - Class
   - Chromebook number
4. Click "Save"

## 📊 How It Works

### For Students
1. **Install Extension**: Students install the Chrome extension
2. **Enter Info**: Students input their name, class, and Chromebook number
3. **Automatic Tracking**: The extension automatically tracks all website visits
4. **Game Detection**: Automatically detects visits to popular game sites
5. **Data Reporting**: Sends browsing data to the teacher's dashboard

### For Teachers
1. **Dashboard Access**: Teachers access the React dashboard
2. **Real-time Monitoring**: See all students' browsing activity in real-time
3. **Game Alerts**: Get notifications when students visit game sites
4. **History View**: Browse through detailed browsing history for each student

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` folder:
```
PORT=3001
```

### Dashboard Configuration
Update the API URL in `dashboard/src/services/api.js` if needed.

## 🎮 Game Site Detection

The extension automatically detects visits to popular game sites including:
- Roblox
- Minecraft
- Fortnite
- Cool Math Games
- And many more...

## 📱 Features

### Chrome Extension
- ✅ Automatic browsing tracking
- ✅ Game site detection
- ✅ Student information input
- ✅ Real-time data reporting
- ✅ Side panel interface

### Teacher Dashboard
- ✅ Real-time student monitoring
- ✅ Game site alerts
- ✅ Detailed browsing history
- ✅ Student activity timeline
- ✅ Responsive design

### Backend API
- ✅ Store browsing data
- ✅ Student management
- ✅ Game detection alerts
- ✅ RESTful API endpoints

## 🚀 Deployment

### Deploy Backend to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy the `backend` folder
4. Update the API URL in the extension and dashboard

### Deploy Dashboard to Vercel
1. Deploy the `dashboard` folder to Vercel
2. Update the API URL to point to your deployed backend

## 📦 Distribution

### For Small Groups (Manual Installation)
1. Zip the `chrome-extension` folder
2. Share the ZIP file with students
3. Students extract and load via Chrome's developer mode

### For Larger Groups
Consider publishing to the Chrome Web Store for easier distribution.

## 🔒 Privacy & Security

- **No Personal Data**: Only browsing URLs are tracked, no personal information
- **Local Storage**: Student information is stored locally on the device
- **Secure API**: Backend uses HTTPS for data transmission
- **Teacher Access**: Only teachers with dashboard access can view data

## 🛠️ Troubleshooting

### Extension Not Working
- Check that the backend is running
- Verify the API URL in the extension
- Check Chrome's developer console for errors

### Dashboard Not Loading
- Ensure the backend is deployed and accessible
- Check the API URL in the dashboard configuration
- Verify CORS settings on the backend

### Data Not Appearing
- Check that students have entered their information
- Verify the extension is properly installed
- Check the backend logs for errors

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all services are running
3. Check the network tab for API calls
4. Ensure all URLs are correctly configured

## 🔄 Updates

When updating the extension:
1. Update the extension code
2. Redeploy the backend and dashboard
3. Update the API URLs in the extension
4. Distribute the updated extension to students

---

**Note**: This extension is designed for educational use in controlled environments. Always ensure compliance with your school's privacy policies and obtain necessary permissions before deployment. 