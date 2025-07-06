# Teacher Dashboard - Classroom Activity Tracker

A modern, user-friendly dashboard for teachers to monitor student activity and engagement in the classroom.

## 🚀 Features

### 📊 Overview Dashboard
- **Real-time statistics** showing total students, active sessions, and alerts
- **Quick insights** into classroom activity at a glance
- **Visual indicators** for immediate attention to game site alerts

### 🚨 Smart Alerts
- **Game site detection** with immediate notifications
- **Searchable alert history** to find specific incidents
- **Detailed information** including student, class, device, and timestamp
- **Empty state handling** when no alerts are present

### 👥 Student Management
- **Student cards** with activity counts and visual indicators
- **Individual student tracking** with detailed activity history
- **Search functionality** to quickly find specific students
- **Responsive grid layout** that works on all devices

### 📈 Activity Monitoring
- **Comprehensive activity log** with filtering and search
- **Real-time updates** every 30 seconds
- **Export functionality** for data analysis and reporting
- **Mobile-responsive tables** for easy viewing

### 🎨 User Experience Improvements
- **Modern, clean interface** with intuitive navigation
- **Loading states** to show when data is being fetched
- **Error handling** with retry options
- **Confirmation dialogs** to prevent accidental actions
- **Responsive design** that works on desktop, tablet, and mobile
- **Accessibility features** with proper focus management

## 🔧 Technical Improvements

### Security & Reliability
- **Proper error handling** for network issues
- **Loading indicators** to prevent confusion
- **Graceful degradation** when data is unavailable
- **Input validation** and sanitization

### Performance
- **Optimized data fetching** with reduced server load
- **Efficient filtering** and search functionality
- **Minimal re-renders** for smooth user experience
- **Compressed assets** for faster loading

### Mobile Responsiveness
- **Touch-friendly interface** with proper button sizes
- **Responsive tables** that scroll horizontally on mobile
- **Adaptive layouts** that work on all screen sizes
- **Optimized navigation** for mobile devices

## 📱 How to Use

### Login
1. Open the teacher dashboard in your browser
2. Enter the password: `teacher123`
3. Click "Login" to access the dashboard

### Navigation
- **Overview**: See key statistics and classroom summary
- **Alerts**: View and search game site alerts
- **Students**: Manage and track individual students
- **Activity**: Monitor all classroom activity

### Key Features
- **Search**: Use the search box in any tab to filter data
- **Export**: Click the "Export" button to download activity data
- **Refresh**: Data automatically refreshes every 30 seconds
- **Logout**: Use the logout button with confirmation dialog

## 🛠️ Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
cd teacher-dashboard
npm install
```

### Running Locally
```bash
npm start
```

The dashboard will open at `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## 🔗 API Integration

The dashboard connects to the backend API at:
- **Production**: `https://backend-khaki-phi-30.vercel.app`
- **Local**: `http://localhost:3000` (if running locally)

### API Endpoints
- `GET /api/history` - Get browsing data and alerts
- `GET /api/students` - Get list of students
- `GET /api/student/:studentId` - Get specific student data
- `GET /api/class/:className` - Get class-specific data

## 🐛 Troubleshooting

### Common Issues

**Dashboard won't load**
- Check your internet connection
- Verify the backend API is running
- Try refreshing the page

**No data showing**
- Ensure the Chrome extension is installed and running
- Check that students are actively using their devices
- Verify the backend is receiving activity data

**Login issues**
- Use the correct password: `teacher123`
- Clear browser cache if needed
- Try a different browser

**Mobile display issues**
- Rotate device to landscape mode for better table viewing
- Use the search function to filter data
- Tap and hold on tables to scroll horizontally

### Error Messages

**"Failed to load data"**
- Network connectivity issue
- Backend server may be down
- Click "Retry" to attempt again

**"No students found"**
- No activity data has been recorded yet
- Students may not be using the Chrome extension
- Check that the extension is properly installed

## 📊 Data Export

The dashboard includes an export feature that downloads:
- All browsing activity data
- Game site alerts
- Export timestamp
- JSON format for easy analysis

Use this data for:
- Parent-teacher conferences
- Administrative reporting
- Student progress tracking
- Classroom management insights

## 🔒 Security Notes

⚠️ **Important**: This is a demo version with a hardcoded password. For production use:

1. Implement proper authentication (OAuth, SSO, etc.)
2. Use environment variables for sensitive data
3. Add rate limiting and request validation
4. Implement proper session management
5. Use HTTPS in production
6. Add audit logging for security events

## 🎯 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and sorting
- [ ] Student attendance tracking
- [ ] Performance analytics
- [ ] Custom alert thresholds
- [ ] Multi-classroom support
- [ ] Parent portal integration
- [ ] Automated reporting
- [ ] Data visualization charts
- [ ] Offline mode support

## 📞 Support

For technical support or feature requests, please contact the development team.

---

**Version**: 2.0.0  
**Last Updated**: December 2024  
**Compatibility**: Chrome Extension + Backend API 