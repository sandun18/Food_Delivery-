import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { assets } from '../assets/assets';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiSave,
  FiShoppingBag,
  FiCheckCircle
} from 'react-icons/fi';
import styles from './Profile.module.css';

/**
 * User Profile Page Component
 * Allows viewing and updating user name, phone number, and delivery address.
 * Keeps Email address read-only.
 * Synchronizes with PUT /api/user/profile and global AppContext.
 */
export default function Profile() {
  const navigate = useNavigate();
  const { url, token, user, setUser } = useAppContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch live user profile from backend on mount
  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${url}/api/user/profile`, {
          headers: { token, Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.success && isMounted) {
          const userData = response.data.user;
          const address = userData.address || {};

          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            street: address.street || (typeof address === 'string' ? address : ''),
            city: address.city || '',
            state: address.state || '',
            zipCode: address.zipCode || address.zipcode || '',
            country: address.country || 'Sri Lanka'
          });

          // Sync context user
          if (setUser) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to local context user if available
        if (user && isMounted) {
          const address = user.address || {};
          setFormData((prev) => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            zipCode: address.zipCode || '',
            country: address.country || 'Sri Lanka'
          }));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [token, url, setUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 2. Handle Profile Update via PUT /api/user/profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Full name is required');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
          country: formData.country.trim()
        }
      };

      const response = await axios.put(`${url}/api/user/profile`, payload, {
        headers: { token, Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Profile updated successfully!');
        if (response.data.user && setUser) {
          setUser(response.data.user);
        }
      } else {
        toast.error(response.data?.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      const msg = error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // If user is not authenticated
  if (!token) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.authPromptCard}>
          <div className={styles.lockCircle}>
            <FiLock />
          </div>
          <h2>Authentication Required</h2>
          <p>Please sign in to view and manage your profile details, contact info, and delivery address.</p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/signin', { state: { from: { pathname: '/profile' } } })}
          >
            Sign In to Your Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Account Profile & Address</h1>
          <p className={styles.subtitle}>
            Manage your personal contact details and saved delivery destination.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/myorders" className={styles.ordersBtn}>
            <FiShoppingBag />
            <span>My Orders</span>
          </Link>
        </div>
      </header>

      {/* Main Grid Layout: User Sidebar Card + Editable Form */}
      <div className={styles.profileLayout}>
        {/* Left Column: User Summary Card */}
        <aside className={styles.userSidebarCard}>
          <div className={styles.avatarWrapper}>
            <img
              src={assets.profile_image}
              alt={formData.name || 'User Profile'}
              className={styles.avatarImage}
            />
            <span className={styles.avatarBadge} title="Active Member" />
          </div>
          <h3 className={styles.userName}>{formData.name || 'Foodies Customer'}</h3>
          <p className={styles.userEmail}>{formData.email || 'customer@example.com'}</p>
          <span className={styles.roleBadge}>Verified Customer</span>
        </aside>

        {/* Right Column: Profile & Address Form */}
        <main className={styles.formCard}>
          <form onSubmit={handleSubmit} noValidate>
            {/* 1. Personal Information */}
            <section className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <FiUser className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Personal Details</h2>
              </div>

              <div className={styles.formGrid}>
                {/* Full Name (Editable) */}
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Full Name
                  </label>
                  <div className={styles.inputWrapper}>
                    <FiUser className={styles.inputIcon} aria-hidden="true" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                {/* Email Address (Read-Only) */}
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Email Address <span className={styles.readOnlyBadge}>Read-only</span>
                  </label>
                  <div className={`${styles.inputWrapper} ${styles.readOnlyWrapper}`}>
                    <FiMail className={styles.inputIcon} aria-hidden="true" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      disabled
                      className={`${styles.formInput} ${styles.readOnlyInput}`}
                      title="Email address cannot be modified"
                    />
                  </div>
                </div>

                {/* Phone Number (Editable) */}
                <div className={`${styles.formGroup} ${styles.fullSpan}`}>
                  <label htmlFor="phone" className={styles.formLabel}>
                    Phone Number
                  </label>
                  <div className={styles.inputWrapper}>
                    <FiPhone className={styles.inputIcon} aria-hidden="true" />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+94 77 123 4567"
                      className={styles.formInput}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Delivery Address */}
            <section className={styles.formSection} style={{ marginTop: '1.5rem' }}>
              <div className={styles.sectionHeader}>
                <FiMapPin className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Delivery Address</h2>
              </div>

              <div className={styles.formGrid}>
                {/* Street Address */}
                <div className={`${styles.formGroup} ${styles.fullSpan}`}>
                  <label htmlFor="street" className={styles.formLabel}>
                    Street Address / Apartment
                  </label>
                  <div className={styles.inputWrapper}>
                    <FiMapPin className={styles.inputIcon} aria-hidden="true" />
                    <input
                      id="street"
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="123 Galle Road, Apt 4B"
                      className={styles.formInput}
                    />
                  </div>
                </div>

                {/* City */}
                <div className={styles.formGroup}>
                  <label htmlFor="city" className={styles.formLabel}>
                    City
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Colombo"
                      className={styles.formInput}
                    />
                  </div>
                </div>

                {/* State / Province */}
                <div className={styles.formGroup}>
                  <label htmlFor="state" className={styles.formLabel}>
                    State / Province
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Western Province"
                      className={styles.formInput}
                    />
                  </div>
                </div>

                {/* Postal Code */}
                <div className={styles.formGroup}>
                  <label htmlFor="zipCode" className={styles.formLabel}>
                    Postal / Zip Code
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="00300"
                      className={styles.formInput}
                    />
                  </div>
                </div>

                {/* Country */}
                <div className={styles.formGroup}>
                  <label htmlFor="country" className={styles.formLabel}>
                    Country
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Sri Lanka"
                      className={styles.formInput}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={saving}
                className={styles.saveBtn}
                icon={<FiSave />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
