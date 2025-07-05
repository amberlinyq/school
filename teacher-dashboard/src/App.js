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

  // Simple password check (in real app, use proper authentication)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'teacher123') {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect password. Try: teacher123');
    }
  };

  // Fetch data from backend
  const fetchData = async () => {
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
    }
  };

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '400px', margin: '100px auto' }}>
          <h1>Teacher Dashboard</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
            Password: teacher123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Classroom Activity Tracker</h1>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="btn"
          style={{ marginBottom: '16px' }}
        >
          Logout
        </button>
      </div>

      {/* Game Site Alerts */}
      {gameSiteAlerts.length > 0 && (
        <div className="card">
          <h2>🚨 Game Site Alerts</h2>
          <div className="alert alert-danger">
            {gameSiteAlerts.length} game site visit(s) detected!
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Chromebook</th>
                <th>Website</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {gameSiteAlerts.slice(-5).map((alert, index) => (
                <tr key={index}>
                  <td>{alert.studentName || 'Unknown'}</td>
                  <td>{alert.className || 'Unknown'}</td>
                  <td>{alert.chromebookNumber || 'Unknown'}</td>
                  <td>{alert.url}</td>
                  <td>{new Date(alert.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student List */}
      <div className="card">
        <h2>Students ({students.length})</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {students.map((student, index) => (
            <button
              key={index}
              onClick={() => setSelectedStudent(student)}
              className="btn"
              style={{
                backgroundColor: selectedStudent === student ? '#007bff' : '#f8f9fa',
                color: selectedStudent === student ? 'white' : 'black'
              }}
            >
              {student}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Student Activity */}
      {selectedStudent && (
        <div className="card">
          <h2>Activity for {selectedStudent}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Website</th>
                <th>Time</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {browsingData
                .filter(item => item.studentId === selectedStudent)
                .slice(-20)
                .reverse()
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.url}</td>
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

      {/* All Activity */}
      <div className="card">
        <h2>Recent Activity (All Students)</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Chromebook</th>
              <th>Website</th>
              <th>Time</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {browsingData.slice(-10).reverse().map((item, index) => (
              <tr key={index}>
                <td>{item.studentName || 'Unknown'}</td>
                <td>{item.className || 'Unknown'}</td>
                <td>{item.chromebookNumber || 'Unknown'}</td>
                <td>{item.url}</td>
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
  );
}

export default App; 
