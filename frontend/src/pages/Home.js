import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="container">
        <div className="hero">
          <h1>Certificate Verification System</h1>
          <p>
            Streamline the process of issuing and verifying internship certificates
          </p>
          <div>
            <Link to="/search" className="btn btn-primary">
              Search Certificate
            </Link>
            <Link to="/admin/login" className="btn btn-secondary">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="features">
          <div className="feature-card">
            <h3>🔐 User Roles & Authentication</h3>
            <p>Secure admin and student account management with encrypted login</p>
          </div>

          <div className="feature-card">
            <h3>📊 Data Management</h3>
            <p>Upload bulk student data via Excel sheet, stored securely in MongoDB</p>
          </div>

          <div className="feature-card">
            <h3>📜 Certificate Generation</h3>
            <p>Automatically generate certificates with student information</p>
          </div>

          <div className="feature-card">
            <h3>🔍 Certificate Search</h3>
            <p>Search and verify certificates using unique Certificate ID</p>
          </div>

          <div className="feature-card">
            <h3>📥 Download Certificates</h3>
            <p>Download certificates in printable PDF format</p>
          </div>

          <div className="feature-card">
            <h3>🔒 Security & Integrity</h3>
            <p>Data validation and encrypted access controls for data integrity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
