import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TopNav.css';

const TopNav = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <Link to="/" className="brand-logo">
          SameerGram
        </Link>
        <div className="nav-actions">
          {user ? (
            <>
              <div className="user-profile-badge">
                <span className="user-name">{user.user.fullName || user.user.name}</span>
                <button onClick={logout} className="logout-mini-btn" title="Logout">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <Link to="/register" className="nav-btn secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span>Register</span>
            </Link>
          )}
          <Link to="/create-food" className="nav-btn primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span>Post</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
