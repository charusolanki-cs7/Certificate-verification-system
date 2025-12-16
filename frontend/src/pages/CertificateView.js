import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { certificateAPI } from '../utils/api';

const CertificateView = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificate();
  }, [certificateId]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const response = await certificateAPI.search(certificateId);
      setCertificate(response.data.data.certificate);
    } catch (error) {
      const message = error.response?.data?.message || 'Certificate not found';
      toast.error(message);
      setTimeout(() => navigate('/search'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await certificateAPI.download(certificateId);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to download certificate';
      toast.error(message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="container">
        <div className="error-container">
          Certificate not found. Redirecting to search page...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="certificate-container">
        <div className="certificate-header">
          <h1>🎓 Certificate Details</h1>
          {certificate.isValid ? (
            <div className="success-container" style={{ marginTop: '1rem' }}>
              ✓ This certificate is valid and verified
            </div>
          ) : (
            <div className="error-container" style={{ marginTop: '1rem' }}>
              ✗ This certificate has been revoked
            </div>
          )}
        </div>

        <div className="certificate-details">
          <div className="detail-row">
            <div className="detail-label">Certificate ID:</div>
            <div className="detail-value">
              <strong>{certificate.certificateId}</strong>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Student Name:</div>
            <div className="detail-value">{certificate.studentName}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Student ID:</div>
            <div className="detail-value">{certificate.studentId}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Internship Domain:</div>
            <div className="detail-value">
              <strong>{certificate.internshipDomain}</strong>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Start Date:</div>
            <div className="detail-value">
              {new Date(certificate.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">End Date:</div>
            <div className="detail-value">
              {new Date(certificate.endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Issue Date:</div>
            <div className="detail-value">
              {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Duration:</div>
            <div className="detail-value">
              {(() => {
                const start = new Date(certificate.startDate);
                const end = new Date(certificate.endDate);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const months = Math.floor(diffDays / 30);
                const days = diffDays % 30;
                return `${months} month${months !== 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}`;
              })()}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={handleDownload}
            className="btn btn-primary"
            disabled={downloading || !certificate.isValid}
            style={{ marginRight: '1rem' }}
          >
            {downloading ? 'Downloading...' : '📥 Download Certificate PDF'}
          </button>
          
          <button
            onClick={() => navigate('/search')}
            className="btn btn-secondary"
          >
            Search Another Certificate
          </button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f7f9fc', borderRadius: '5px', fontSize: '0.9rem', color: '#666' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Verification Information:</strong>
          </p>
          <p>
            This certificate has been digitally verified and is stored in our secure database.
            You can verify this certificate at any time by searching with the Certificate ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
