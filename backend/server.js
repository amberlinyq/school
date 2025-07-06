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
  // Get unique student IDs
  const students = [...new Set(browsingData.map(item => item.studentId))];
  res.json(students);
});

app.get('/api/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const studentData = browsingData.filter(item => item.studentId === studentId);
  res.json(studentData);
});

// Get students by class
app.get('/api/class/:className', (req, res) => {
  const { className } = req.params;
  const classData = browsingData.filter(item => item.className === className);
  res.json(classData);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Classroom Activity Tracker API',
    status: 'running',
    students: browsingData.length > 0 ? [...new Set(browsingData.map(item => item.studentId))] : []
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