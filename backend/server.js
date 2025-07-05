const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database later)
let browsingData = [];
let gameSiteAlerts = [];

// API Routes
app.post('/api/activity', (req, res) => {
  const activity = req.body;
  
  // Add timestamp if not present
  if (!activity.timestamp) {
    activity.timestamp = Date.now();
  }
  
  // Store the activity
  browsingData.push(activity);
  
  // If it's a game site, add to alerts
  if (activity.isGameSite) {
    gameSiteAlerts.push({
      ...activity,
      alertTime: Date.now()
    });
  }
  
  console.log('Activity received:', activity);
  res.json({ success: true });
});

app.get('/api/history', (req, res) => {
  res.json({
    browsingData,
    gameSiteAlerts
  });
});

app.get('/api/students', (req, res) => {
  // Get unique device names
  const students = [...new Set(browsingData.map(item => item.deviceName))];
  res.json(students);
});

app.get('/api/student/:deviceName', (req, res) => {
  const { deviceName } = req.params;
  const studentData = browsingData.filter(item => item.deviceName === deviceName);
  res.json(studentData);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Classroom Activity Tracker API',
    status: 'running',
    students: browsingData.length > 0 ? [...new Set(browsingData.map(item => item.deviceName))] : []
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Ready to receive activity data from Chrome extension!');
  });
}

// For serverless deployment
module.exports = app; 