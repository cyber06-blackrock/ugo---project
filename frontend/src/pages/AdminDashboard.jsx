import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, RefreshCw, Download } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'rider', 'driver'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('ugo_token');
    if (!storedToken) {
      navigate('/login');
      return;
    }
    setToken(storedToken);
    fetchAllUsers(storedToken);

    // Auto-refresh users every 5 seconds
    const interval = setInterval(() => {
      fetchAllUsers(storedToken);
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchAllUsers = async (authToken) => {
    setLoading(true);
    setError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/users/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ugo_token');
    localStorage.removeItem('ugo_user');
    navigate('/login');
  };

  const handleRefresh = () => {
    if (token) {
      fetchAllUsers(token);
    }
  };

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      alert('No users to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Role', 'Joined Date', 'Vehicle Type'];
    const rows = filteredUsers.map(user => [
      user.name,
      user.email || 'N/A',
      user.phone || 'N/A',
      user.role,
      new Date(user.createdAt).toLocaleDateString(),
      user.vehicleType || 'N/A',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ugo-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filter users based on role and search term
  const filteredUsers = users.filter(user => {
    const matchesRole = filter === 'all' || user.role === filter;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phone && user.phone.includes(searchTerm));
    return matchesRole && matchesSearch;
  });

  const riderCount = users.filter(u => u.role === 'rider').length;
  const driverCount = users.filter(u => u.role === 'driver').length;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">U</span>
            <span className="logo-text">Ugo Admin</span>
          </div>
        </div>
        <div className="header-right">
          <button className="header-btn" onClick={handleRefresh} title="Refresh users">
            <RefreshCw size={18} />
          </button>
          <button className="header-btn logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="admin-container">
        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚗</div>
            <div className="stat-content">
              <div className="stat-value">{riderCount}</div>
              <div className="stat-label">Riders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🧑‍💼</div>
            <div className="stat-content">
              <div className="stat-value">{driverCount}</div>
              <div className="stat-label">Drivers</div>
            </div>
          </div>
        </section>

        {/* Controls Section */}
        <section className="controls-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({users.length})
            </button>
            <button
              className={`filter-btn ${filter === 'rider' ? 'active' : ''}`}
              onClick={() => setFilter('rider')}
            >
              Riders ({riderCount})
            </button>
            <button
              className={`filter-btn ${filter === 'driver' ? 'active' : ''}`}
              onClick={() => setFilter('driver')}
            >
              Drivers ({driverCount})
            </button>
          </div>
          <button className="export-btn" onClick={handleExportCSV}>
            <Download size={16} />
            Export CSV
          </button>
        </section>

        {/* Users Table */}
        <section className="users-section">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <h3>No users found</h3>
              <p>
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'No registered users yet'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Vehicle Type</th>
                    <th>Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="user-row">
                      <td className="user-name">
                        <div className="name-badge">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </td>
                      <td>{user.email || <span className="na">N/A</span>}</td>
                      <td>{user.phone || <span className="na">N/A</span>}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role === 'rider' ? '🚗' : '🧑‍💼'} {user.role}
                        </span>
                      </td>
                      <td>{user.vehicleType || <span className="na">N/A</span>}</td>
                      <td className="date">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="status-badge active">✓ Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Results Info */}
        {!loading && filteredUsers.length > 0 && (
          <div className="results-info">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
