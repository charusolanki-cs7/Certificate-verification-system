import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, admin, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎓 CertVerify
        </Link>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search">Search Certificate</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/admin/dashboard">Dashboard</Link></li>
              <li>
                <span style={{ color: '#666' }}>
                  Welcome, {admin?.name}
                </span>
              </li>
              <li>
                <button onClick={logout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/admin/login">Admin Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
