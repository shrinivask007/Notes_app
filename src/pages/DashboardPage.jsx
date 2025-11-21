import React, { useState, useEffect } from "react";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [usersData, setUsersData] = useState({});
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNotes: 0,
    averageNotesPerUser: 0,
    activeUsers: 0
  });

  useEffect(() => {
    const allNotesData = localStorage.getItem("notesData");
    const parsedNotesData = allNotesData ? JSON.parse(allNotesData) : {};
    
    setUsersData(parsedNotesData);

    const userCount = Object.keys(parsedNotesData).length;
    let totalNotesCount = 0;
    let activeUsersCount = 0;
    
    Object.values(parsedNotesData).forEach(userNotes => {
      totalNotesCount += userNotes.length;
      if (userNotes.length > 0) {
        activeUsersCount++;
      }
    });

    const averageNotes = userCount > 0 ? (totalNotesCount / userCount).toFixed(1) : 0;

    setStats({
      totalUsers: userCount,
      totalNotes: totalNotesCount,
      averageNotesPerUser: averageNotes,
      activeUsers: activeUsersCount
    });
  }, []);

  const getUsernameById = (userId) => {
    const userMap = {
      "user0": "Admin",
      "user1": "User 1", 
      "user2": "User 2"
    };
    return userMap[userId] || `User ${userId}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of NotesApp analytics</p>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Total Notes</h3>
            <p className="stat-number">{stats.totalNotes}</p>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Active Users</h3>
            <p className="stat-number">{stats.activeUsers}</p>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Avg per User</h3>
            <p className="stat-number">{stats.averageNotesPerUser}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Users Overview</h2>
          <span className="section-badge">{stats.totalUsers} users</span>
        </div>
        
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(usersData).map(([userId, notes]) => (
                <tr key={userId}>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{getUsernameById(userId)}</div>
                      <div className="user-id">ID: {userId}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${notes.length > 0 ? 'active' : 'inactive'}`}>
                      {notes.length > 0 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="notes-count-cell">
                      <span className="notes-count">{notes.length}</span>
                      {notes.length > 0 && (
                        <span className="notes-label">notes</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      {notes.length > 0 ? (
                        formatDate(notes[notes.length - 1].id)
                      ) : (
                        <span className="no-activity">No activity</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {Object.keys(usersData).length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Data Available</h3>
              <p>User statistics will appear here once users start creating notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;