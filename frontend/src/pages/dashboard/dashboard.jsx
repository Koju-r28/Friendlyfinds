import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';


const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, logout } = useAuth();

  const pages = [
    { id: 'home', name: 'Home' },
    { id: 'users', name: 'Users' },
    { id: 'settings', name: 'Settings' },
  ];

  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return (
          <div>
            <h2 className="content-title">Home Dashboard</h2>
            <p className="content-text">Welcome to your dashboard! This page is protected and only accessible after login.</p>
          </div>
        );
      case 'users':
        return (
          <div>
            <h2 className="content-title">Users</h2>
            <p className="content-text">Manage your users here.</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2 className="content-title">Settings</h2>
            <p className="content-text">Configure your application settings.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="app-title">Friendly Finds</h1>
          <div className="user-section">
            <span className="welcome-text">Welcome, {user?.username}</span>
            <button onClick={logout} className="logout-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 17 21 12 16 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`nav-button ${currentPage === page.id ? 'active' : ''}`}
              >
                {page.name}
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          <div className="content-card">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;