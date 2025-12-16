import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Admin Login</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="admin@example.com"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="form-link">
          Don't have an account? <Link to="/admin/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
