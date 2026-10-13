import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { assets } from '../assets/assets';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './Auth.module.css';

/**
 * Sign In Page
 * Authenticates user via POST /api/user/login, saves JWT token in localStorage,
 * updates global context, and redirects user.
 */
export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { url, setToken, setUser } = useAppContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Return to previous target page or home
  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/login`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (response.data && response.data.success) {
        const { token, user } = response.data;

        // 1. Store in localStorage
        localStorage.setItem('token', token);

        // 2. Update Global AppContext
        setToken(token);
        if (user && setUser) {
          setUser(user);
        }

        toast.success(response.data.message || 'Login successful!');
        navigate(from, { replace: true });
      } else {
        toast.error(response.data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Sign In Error:', error);
      const serverMessage = error.response?.data?.message || 'Invalid email or password';
      toast.error(serverMessage);
      setErrors((prev) => ({
        ...prev,
        general: serverMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {/* Header */}
        <div className={styles.authHeader}>
          <Link to="/">
            <img src={assets.logo} alt="Foodies Logo" className={styles.authLogo} />
          </Link>
          <h2 className={styles.authTitle}>Sign In to Foodies</h2>
          <p className={styles.authSubtitle}>
            Welcome back! Please enter your details to access your account.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
          {errors.general && (
            <div className={styles.errorFeedback} role="alert">
              {errors.general}
            </div>
          )}

          {/* Email Input */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email Address
            </label>
            <div className={`${styles.inputWrapper} ${errors.email ? styles.hasError : ''}`}>
              <FiMail className={styles.inputIcon} aria-hidden="true" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={styles.formInput}
                autoComplete="email"
                required
              />
            </div>
            {errors.email && (
              <span className={styles.errorFeedback}>{errors.email}</span>
            )}
          </div>

          {/* Password Input */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <div className={`${styles.inputWrapper} ${errors.password ? styles.hasError : ''}`}>
              <FiLock className={styles.inputIcon} aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={styles.formInput}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorFeedback}>{errors.password}</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className={styles.formExtras}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className={styles.forgotLink} onClick={(e) => {
              e.preventDefault();
              toast.info('Password reset link has been dispatched to your email (demo).');
            }}>
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            fullWidth
            className={styles.submitBtn}
          >
            Sign In
          </Button>
        </form>

        {/* Footer Link to Sign Up */}
        <div className={styles.authFooter}>
          <span>Don't have an account?</span>
          <Link to="/signup" className={styles.switchLink}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
