# 🏫 Classroom Activity Tracker

A comprehensive full-stack application that helps teachers monitor student activity and engagement in real-time. Built with React, Node.js, and Chrome Extension technology.

## 🚀 Live Demo

**Teacher Dashboard:** [https://teacher-dashboard-amberlin.vercel.app](https://teacher-dashboard-amberlin.vercel.app)  
**Backend API:** [https://backend-khaki-phi-30.vercel.app](https://backend-khaki-phi-30.vercel.app)

## 📋 Quick Start

### 🎯 Test the Application

1. **Open the Teacher Dashboard:** Click the live demo link above
2. **Login:** Use password `teacher123`
3. **Explore Features:**
   - View student overview with red/green flags
   - Click student cards to see detailed activity
   - Export individual student data to CSV
   - Monitor real-time alerts and activity

### 🔧 Technical Stack

- **Frontend:** React.js, CSS3, Modern JavaScript (ES6+)
- **Backend:** Node.js, Express.js, RESTful APIs
- **Extension:** Chrome Extension API, Manifest V3
- **Deployment:** Vercel (Frontend & Backend)
- **Version Control:** Git, GitHub

## 🎯 Project Overview

This application consists of three main components:

### 1. **Teacher Dashboard** (`/teacher-dashboard`)
A modern, responsive web application that provides teachers with real-time insights into student activity.

**Key Features:**
- 📊 **Overview Dashboard** - Quick statistics and student cards
- 🚨 **Smart Alerts** - Game site detection with immediate notifications
- 👥 **Student Management** - Individual student tracking with activity history
- 📈 **Activity Monitoring** - Comprehensive activity logs with filtering
- 📊 **Data Export** - CSV export for administrative reporting
- 🎨 **Modern UI** - Responsive design with intuitive navigation

### 2. **Chrome Extension** (`/chrome-extension`)
A browser extension that monitors student browsing activity and sends data to the backend.

**Features:**
- Real-time browsing activity tracking
- Game site detection and flagging
- Automatic data transmission to backend
- Privacy-compliant monitoring

### 3. **Backend API** (`/backend`)
A RESTful API that processes and stores student activity data.

**Endpoints:**
- `POST /api/activity` - Receive student activity data
- `GET /api/history` - Retrieve browsing history and alerts
- `GET /api/students` - Get list of active students
- `GET /api/student/:id` - Get specific student data

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Chrome browser (for extension testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amberlinyq/school.git
   cd school
   ```

2. **Install dependencies**
   ```bash
   # Teacher Dashboard
   cd teacher-dashboard
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Run the applications**
   ```bash
   # Teacher Dashboard (Port 3000)
   cd teacher-dashboard
   npm start
   
   # Backend (Port 3001)
   cd ../backend
   npm start
   ```

4. **Load Chrome Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `chrome-extension` folder

## 🎨 User Experience Highlights

### Teacher Dashboard Features
- **Student Cards** with avatars and activity indicators
- **Red Flags** for students who visited game sites
- **Green Indicators** for students staying focused
- **Clickable Cards** that open detailed activity modals
- **CSV Export** for individual student data
- **Real-time Updates** every 30 seconds
- **Search & Filter** functionality across all data
- **Mobile Responsive** design for tablet use

### Technical Achievements
- **Modern React Patterns** with hooks and functional components
- **Responsive Design** that works on all devices
- **Error Handling** with user-friendly messages
- **Loading States** and smooth animations
- **Accessibility Features** with proper focus management
- **Performance Optimization** with efficient data fetching

## 📊 Demo Data

The application includes demo data to showcase functionality:
- Sample student activities and browsing history
- Game site alerts and regular site visits
- Multiple student profiles with different activity levels

## 🔒 Security Notes

⚠️ **Demo Version:** This is a demonstration project with simplified authentication. For production use, implement:
- Proper authentication (OAuth, SSO)
- Environment variables for sensitive data
- Rate limiting and request validation
- HTTPS enforcement
- Audit logging

## 🚀 Deployment

### Frontend (Teacher Dashboard)
- **Platform:** Vercel
- **URL:** https://teacher-dashboard-amberlin.vercel.app
- **Build Command:** `npm run build`
- **Output Directory:** `build`

### Backend API
- **Platform:** Vercel
- **URL:** https://backend-khaki-phi-30.vercel.app
- **Runtime:** Node.js
- **Framework:** Express.js

## 🎯 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Advanced analytics and reporting
- [ ] Multi-classroom support
- [ ] Parent portal integration
- [ ] Automated attendance tracking
- [ ] Performance analytics dashboard
- [ ] Custom alert thresholds
- [ ] Data visualization charts

## 📞 Contact & Support

**Developer:** Amber Lin  
**GitHub:** [github.com/amberlinyq](https://github.com/amberlinyq)  
**Project Repository:** [github.com/amberlinyq/school](https://github.com/amberlinyq/school)

For technical questions or feature requests, please open an issue on GitHub.
