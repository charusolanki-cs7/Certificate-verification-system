import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const AdminRegister = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...registerData } = values;
      const result = await register(registerData);
      
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Admin Registration</h2>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder="John Doe"
                />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>

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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="form-link">
          Already have an account? <Link to="/admin/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
