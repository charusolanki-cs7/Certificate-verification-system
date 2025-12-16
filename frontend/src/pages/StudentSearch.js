import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { certificateAPI } from '../utils/api';

const SearchSchema = Yup.object().shape({
  certificateId: Yup.string()
    .required('Certificate ID is required')
    .matches(/^[A-Z0-9-]+$/, 'Invalid certificate ID format')
});

const StudentSearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const response = await certificateAPI.search(values.certificateId.trim().toUpperCase());
      
      if (response.data.status === 'success') {
        toast.success('Certificate found!');
        navigate(`/certificate/${values.certificateId.trim().toUpperCase()}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Certificate not found';
      toast.error(message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-container">
          <h2>Search Certificate</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Enter your Certificate ID to view and download your certificate
          </p>

          <Formik
            initialValues={{ certificateId: '' }}
            validationSchema={SearchSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="certificateId">Certificate ID</label>
                  <Field
                    type="text"
                    name="certificateId"
                    id="certificateId"
                    placeholder="e.g., CERT-2025-123456"
                    style={{ textTransform: 'uppercase' }}
                  />
                  <ErrorMessage name="certificateId" component="div" className="error-message" />
                  <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                    Format: CERT-YEAR-NUMBER (e.g., CERT-2025-123456)
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || loading}
                  style={{ width: '100%' }}
                >
                  {isSubmitting || loading ? 'Searching...' : 'Search Certificate'}
                </button>
              </Form>
            )}
          </Formik>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f7f9fc', borderRadius: '5px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Need help?</h4>
            <ul style={{ paddingLeft: '1.5rem', color: '#666' }}>
              <li>Make sure you enter the correct Certificate ID</li>
              <li>Certificate IDs are case-insensitive</li>
              <li>Format should be: CERT-YEAR-NUMBER</li>
              <li>Contact your administrator if you don't have your Certificate ID</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;
