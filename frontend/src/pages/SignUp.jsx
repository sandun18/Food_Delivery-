import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { assets } from '../assets/assets';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import styles from './Auth.module.css';

/**
 * Sign Up Page
 * Handles new user registration via POST /api/user/register, enforces minimum 8 characters password length,
 * performs auto-login with JWT token, and displays success toast notification.
 */
export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { url, setToken, setUser } = useAppContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreedToTerms: true
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Return to previous target page or home
  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (enforcing 8+ characters required by backend)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Terms agreement
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms of Service';
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

    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/register`, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (response.data && response.data.success) {
        const { token, user, message } = response.data;

        // 1. Auto-login: Store token in localStorage
        localStorage.setItem('token', token);

        // 2. Update Global AppContext
        setToken(token);
        if (user && setUser) {
          setUser(user);
        }

        // 3. Success Toast Notification
        toast.success(message || 'Account created successfully! Welcome to Foodies!');

        // 4. Redirect to home or target page
        navigate(from, { replace: true });
      } else {
        toast.error(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign Up Error:', error);
      const serverMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(serverMessage);
      setErrors((prev) => ({
        ...prev,
        general: serverMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const isPasswordLengthValid = formData.password.length >= 8;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {/* Header */}
        <div className={styles.authHeader}>
          <Link to="/">
            <img src={assets.logo} alt="Foodies Logo" className={styles.authLogo} />
          </Link>
          <h2 className={styles.authTitle}>Create an Account</h2>
          <p className={styles.authSubtitle}>
            Join Foodies today to order delicious chef-crafted meals straight to your door.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
          {errors.general && (
            <div className={styles.errorFeedback} role="alert">
              {errors.general}
            </div>
          )}

          {/* Name Input */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              Full Name
            </label>
            <div className={`${styles.inputWrapper} ${errors.name ? styles.hasError : ''}`}>
              <FiUser className={styles.inputIcon} aria-hidden="true" />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={styles.formInput}
                autoComplete="name"
                required
              />
            </div>
            {errors.name && (
              <span className={styles.errorFeedback}>{errors.name}</span>
            )}
          </div>

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
                placeholder="At least 8 characters"
                className={styles.formInput}
                autoComplete="new-password"
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
            {errors.password ? (
              <span className={styles.errorFeedback}>{errors.password}</span>
            ) : formData.password.length > 0 ? (
              <span style={{
                fontSize: '0.78rem',
                color: isPasswordLengthValid ? 'var(--success)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                marginTop: '0.2rem'
              }}>
                <FiCheckCircle color={isPasswordLengthValid ? 'var(--success)' : '#ccc'} />
                {isPasswordLengthValid ? 'Strong password length (8+ characters)' : `${formData.password.length}/8 characters minimum`}
              </span>
            ) : null}
          </div>

          {/* Terms Agreement Checkbox */}
          <div className={styles.formGroup}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleInputChange}
              />
              <span>
                By continuing, I agree to the <a href="#terms" className={styles.forgotLink}>Terms of Service</a> & <a href="#privacy" className={styles.forgotLink}>Privacy Policy</a>
              </span>
            </label>
            {errors.agreedToTerms && (
              <span className={styles.errorFeedback}>{errors.agreedToTerms}</span>
            )}
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
            Create Account
          </Button>
        </form>

        {/* Footer Link to Sign In */}
        <div className={styles.authFooter}>
          <span>Already have an account?</span>
          <Link to="/signin" className={styles.switchLink}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
