const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let browsingData = [];
let gameSiteAlerts = [];

// API Routes
app.post('/api/activity', (req, res) => {
  const activity = req.body;
  
  if (!activity.timestamp) {
    activity.timestamp = Date.now();
  }
  
  browsingData.push(activity);
  
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
  // Get unique students
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

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Classroom Activity Tracker API',
    status: 'running',
    students: browsingData.length > 0 ? [...new Set(browsingData.map(item => item.studentId))] : []
  });
});

// Export for Vercel
module.exports = app; 