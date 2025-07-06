import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [browsingData, setBrowsingData] = useState([]);
  const [gameSiteAlerts, setGameSiteAlerts] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  // Simple password check (in real app, use proper authentication)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'teacher123') {
      setIsLoggedIn(true);
      setError(null);
    } else {
      setError('Incorrect password. Try: teacher123');
    }
  };

  // Fetch data from backend with proper error handling
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [historyRes, studentsRes] = await Promise.all([
        axios.get('https://backend-khaki-phi-30.vercel.app/api/history'),
        axios.get('https://backend-khaki-phi-30.vercel.app/api/students')
      ]);
      
      setBrowsingData(historyRes.data.browsingData || []);
      setGameSiteAlerts(historyRes.data.gameSiteAlerts || []);
      setStudents(studentsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data every 30 seconds (less frequent to reduce server load)
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Filter data based on search term
  const filteredBrowsingData = browsingData.filter(item => 
    item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGameAlerts = gameSiteAlerts.filter(alert =>
    alert.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get student activity
  const getStudentActivity = (studentId) => {
    return browsingData
      .filter(item => item.studentId === studentId)
      .slice(-20)
      .reverse();
  };

  // Export data function
  const exportData = () => {
    const data = {
      browsingData,
      gameSiteAlerts,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classroom-activity-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export individual student data to CSV
  const exportStudentCSV = (studentId) => {
    const studentData = browsingData.filter(item => item.studentId === studentId);
    
    if (studentData.length === 0) {
      alert('No data available for this student');
      return;
    }

    // Create CSV headers
    const headers = ['Date', 'Time', 'Website', 'Type', 'Class', 'Device'];
    
    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...studentData.map(item => [
        new Date(item.timestamp).toLocaleDateString(),
        new Date(item.timestamp).toLocaleTimeString(),
        `"${item.url}"`,
        item.isGameSite ? 'Game Site' : 'Regular Site',
        item.className || 'Unknown',
        item.chromebookNumber || 'Unknown'
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentId}-activity-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle student card click
  const handleStudentCardClick = (student) => {
    setSelectedStudentForModal(student);
    setShowStudentModal(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🏫 Teacher Dashboard</h1>
            <p>Monitor classroom activity and student engagement</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input"
                autoFocus
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="btn btn-primary btn-full">
              Login
            </button>
          </form>
          
          <div className="login-hint">
            <p>Demo password: <code>teacher123</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🏫 Classroom Activity Tracker</h1>
          <div className="header-actions">
            <button 
              onClick={exportData}
              className="btn btn-secondary"
              title="Export data"
            >
              📊 Export
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="btn btn-outline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Alerts ({gameSiteAlerts.length})
        </button>
        <button
          className={`tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          👥 Students ({students.length})
        </button>
        <button
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📈 Activity
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={fetchData} className="btn btn-small">Retry</button>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="overview-grid">
              <div className="stat-card">
                <h3>Total Students</h3>
                <div className="stat-number">{students.length}</div>
              </div>
              <div className="stat-card">
                <h3>Active Sessions</h3>
                <div className="stat-number">
                  {browsingData.filter(item => 
                    Date.now() - new Date(item.timestamp).getTime() < 300000
                  ).length}
                </div>
              </div>
              <div className="stat-card alert">
                <h3>Game Site Alerts</h3>
                <div className="stat-number">{gameSiteAlerts.length}</div>
              </div>
              <div className="stat-card">
                <h3>Total Activity</h3>
                <div className="stat-number">{browsingData.length}</div>
              </div>
            </div>

            {/* Student Overview Table */}
            <div className="content-card">
              <div className="card-header">
                <h2>👥 Student Overview</h2>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              
              {students.length === 0 ? (
                <div className="empty-state">
                  <p>No students found</p>
                  <p>Students will appear here once they start using their devices.</p>
                </div>
              ) : (
                <div className="students-overview-grid">
                  {students
                    .filter(student => student.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((student, index) => {
                      const studentData = browsingData.filter(item => item.studentId === student);
                      const gameSiteVisits = studentData.filter(item => item.isGameSite).length;
                      const lastActivity = studentData.length > 0 
                        ? new Date(Math.max(...studentData.map(item => new Date(item.timestamp))))
                        : null;
                      const isActive = lastActivity && (Date.now() - lastActivity.getTime() < 300000);
                      const hasGameSiteActivity = gameSiteVisits > 0;
                      
                      return (
                        <div 
                          key={index} 
                          className={`student-overview-card ${hasGameSiteActivity ? 'has-game-activity' : 'no-game-activity'} ${isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleStudentCardClick(student)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="student-avatar-container">
                            <div className="student-avatar">
                              {student.charAt(0).toUpperCase()}
                            </div>
                            {hasGameSiteActivity && (
                              <div className="red-flag-badge">🚨</div>
                            )}
                            {!hasGameSiteActivity && (
                              <div className="green-flag-badge">✅</div>
                            )}
                          </div>
                          
                          <div className="student-info">
                            <h3 className="student-name">{student}</h3>
                            <p className="student-class">{studentData[0]?.className || 'Unknown Class'}</p>
                            <p className="student-device">Device: {studentData[0]?.chromebookNumber || 'Unknown'}</p>
                          </div>
                          
                          <div className="student-stats">
                            <div className="stat-item">
                              <span className="stat-label">Activity:</span>
                              <span className="stat-value">{studentData.length}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Game Sites:</span>
                              <span className={`stat-value ${hasGameSiteActivity ? 'danger' : 'success'}`}>
                                {gameSiteVisits}
                              </span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Status:</span>
                              <span className={`status-indicator ${isActive ? 'active' : 'inactive'}`}>
                                {isActive ? '🟢 Active' : '⚪ Inactive'}
                              </span>
                            </div>
                          </div>
                          
                          {lastActivity && (
                            <div className="last-activity">
                              <small>Last: {lastActivity.toLocaleString()}</small>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="content-card">
            <div className="card-header">
              <h2>🚨 Game Site Alerts</h2>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            {filteredGameAlerts.length === 0 ? (
              <div className="empty-state">
                <p>🎉 No game site alerts found!</p>
                <p>Students are staying focused on their work.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Device</th>
                      <th>Website</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGameAlerts.slice(-10).reverse().map((alert, index) => (
                      <tr key={index} className="alert-row">
                        <td>{alert.studentName || 'Unknown'}</td>
                        <td>{alert.className || 'Unknown'}</td>
                        <td>{alert.chromebookNumber || 'Unknown'}</td>
                        <td className="url-cell">
                          <a href={alert.url} target="_blank" rel="noopener noreferrer">
                            {alert.url}
                          </a>
                        </td>
                        <td>{new Date(alert.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="content-card">
            <div className="card-header">
              <h2>👥 Students</h2>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="students-grid">
              {students
                .filter(student => student.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((student, index) => (
                  <button
                    key={index}
                    onClick={() => handleStudentCardClick(student)}
                    className={`student-card ${selectedStudent === student ? 'selected' : ''}`}
                  >
                    <div className="student-avatar">👤</div>
                    <div className="student-name">{student}</div>
                    <div className="student-activity">
                      {getStudentActivity(student).length} activities
                    </div>
                  </button>
                ))}
            </div>

            {selectedStudent && (
              <div className="student-detail">
                <div className="student-detail-header">
                  <h3>Activity for {selectedStudent}</h3>
                  <button 
                    onClick={() => exportStudentCSV(selectedStudent)}
                    className="btn btn-secondary btn-small"
                    title="Export student data to CSV"
                  >
                    📊 Export CSV
                  </button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Website</th>
                        <th>Time</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStudentActivity(selectedStudent).map((item, index) => (
                        <tr key={index}>
                          <td className="url-cell">
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              {item.url}
                            </a>
                          </td>
                          <td>{new Date(item.timestamp).toLocaleString()}</td>
                          <td>
                            {item.isGameSite ? (
                              <span className="badge badge-danger">Game Site</span>
                            ) : (
                              <span className="badge badge-success">Regular Site</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="content-card">
            <div className="card-header">
              <h2>📈 Recent Activity</h2>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search activity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            {filteredBrowsingData.length === 0 ? (
              <div className="empty-state">
                <p>No activity data available</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Device</th>
                      <th>Website</th>
                      <th>Time</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBrowsingData.slice(-20).reverse().map((item, index) => (
                      <tr key={index}>
                        <td>{item.studentName || 'Unknown'}</td>
                        <td>{item.className || 'Unknown'}</td>
                        <td>{item.chromebookNumber || 'Unknown'}</td>
                        <td className="url-cell">
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.url}
                          </a>
                        </td>
                        <td>{new Date(item.timestamp).toLocaleString()}</td>
                        <td>
                          {item.isGameSite ? (
                            <span className="badge badge-danger">Game Site</span>
                          ) : (
                            <span className="badge badge-success">Regular Site</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsLoggedIn(false);
                  setShowLogoutConfirm(false);
                  setSelectedStudent(null);
                  setSearchTerm('');
                  setActiveTab('overview');
                }}
                className="btn btn-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Activity Modal */}
      {showStudentModal && selectedStudentForModal && (
        <div className="modal-overlay">
          <div className="student-modal">
            <div className="modal-header">
              <div className="student-modal-info">
                <div className="student-avatar">
                  {selectedStudentForModal.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{selectedStudentForModal}</h3>
                  <p className="student-modal-details">
                    {browsingData.filter(item => item.studentId === selectedStudentForModal)[0]?.className || 'Unknown Class'} • 
                    Device: {browsingData.filter(item => item.studentId === selectedStudentForModal)[0]?.chromebookNumber || 'Unknown'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowStudentModal(false)}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-stats">
                <div className="stat-item">
                  <span className="stat-number">{getStudentActivity(selectedStudentForModal).length}</span>
                  <span className="stat-label">Total Activities</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number danger">
                    {getStudentActivity(selectedStudentForModal).filter(item => item.isGameSite).length}
                  </span>
                  <span className="stat-label">Game Site Visits</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number success">
                    {getStudentActivity(selectedStudentForModal).filter(item => !item.isGameSite).length}
                  </span>
                  <span className="stat-label">Regular Sites</span>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  onClick={() => exportStudentCSV(selectedStudentForModal)}
                  className="btn btn-primary"
                >
                  📊 Export to CSV
                </button>
                <button 
                  onClick={() => setShowStudentModal(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>

              <div className="activity-list">
                <h4>Recent Activity</h4>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Website</th>
                        <th>Time</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStudentActivity(selectedStudentForModal).map((item, index) => (
                        <tr key={index}>
                          <td className="url-cell">
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              {item.url}
                            </a>
                          </td>
                          <td>{new Date(item.timestamp).toLocaleString()}</td>
                          <td>
                            {item.isGameSite ? (
                              <span className="badge badge-danger">Game Site</span>
                            ) : (
                              <span className="badge badge-success">Regular Site</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 
