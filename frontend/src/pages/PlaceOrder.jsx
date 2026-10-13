import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import OrderSummary from '../components/OrderSummary';
import Button from '../components/Button';
import { food_list as defaultFoodList } from '../data/food';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiArrowLeft,
  FiShield,
  FiCreditCard,
  FiDollarSign
} from 'react-icons/fi';
import styles from './PlaceOrder.module.css';

/**
 * Place Order Page
 * Collects Delivery Address information (First Name, Last Name, Email, Street, City, State, Zip, Phone)
 * and displays Order Summary with automated subtotal, $2 delivery fee, and payment method options.
 */
export default function PlaceOrder() {
  const navigate = useNavigate();
  const { url, token, user, cartItems, food_list, getTotalCartAmount, clearCart } = useAppContext();

  // Combine live food list with fallback
  const allFoods = food_list && food_list.length > 0 ? food_list : defaultFoodList;

  // Pre-fill user data if available
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'cod'
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const subtotal = getTotalCartAmount ? getTotalCartAmount() : 0;
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee : 0;

  // 1. Guard against unauthenticated or empty-cart access
  useEffect(() => {
    if (!token) {
      toast.warning('Please sign in to place an order');
      navigate('/signin', { state: { from: { pathname: '/order' } } });
    } else if (subtotal === 0) {
      toast.info('Your cart is empty. Please add items to proceed.');
      navigate('/cart');
    }
  }, [token, subtotal, navigate]);

  // 2. Pre-fill address and personal info from user profile
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const address = user.address || {};

      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        street: prev.street || address.street || '',
        city: prev.city || address.city || '',
        state: prev.state || address.state || '',
        zipCode: prev.zipCode || address.zipCode || address.zipcode || '',
        country: prev.country || address.country || 'Sri Lanka'
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State / Province is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Postal / Zip code is required';

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3. Handle Order Placement
  const handlePlaceOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) {
      toast.error('Please complete all required delivery details');
      return;
    }

    // Build items array from cartItems
    const orderItems = [];
    allFoods.forEach((item) => {
      const id = item._id || item.id;
      if (cartItems[id] > 0 || cartItems[String(id)] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[id] || cartItems[String(id)]
        });
      }
    });

    if (orderItems.length === 0) {
      toast.error('No items in cart');
      navigate('/cart');
      return;
    }

    setLoading(true);

    const orderData = {
      address: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        country: formData.country.trim(),
        phone: formData.phone.trim()
      },
      items: orderItems,
      amount: grandTotal
    };

    try {
      if (paymentMethod === 'cod') {
        // Place COD Order
        const response = await axios.post(`${url}/api/order/place-cod`, orderData, {
          headers: { token, Authorization: `Bearer ${token}` }
        });

        if (response.data?.success) {
          if (clearCart) clearCart();
          toast.success(response.data.message || 'Order placed successfully with Cash on Delivery!');
          navigate('/myorders');
        } else {
          toast.error(response.data?.message || 'Failed to place COD order');
        }
      } else {
        // Place Stripe Card Order
        const response = await axios.post(`${url}/api/order/place`, orderData, {
          headers: { token, Authorization: `Bearer ${token}` }
        });

        if (response.data?.success && response.data.session_url) {
          // Redirect to Stripe checkout
          window.location.replace(response.data.session_url);
        } else {
          toast.error(response.data?.message || 'Payment session initialization failed');
        }
      }
    } catch (error) {
      console.error('Order placement error:', error);
      const msg = error.response?.data?.message || 'Failed to process order. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.placeOrderPage}>
      {/* Header */}
      <header className={styles.pageHeader}>
        <Link to="/cart" className={styles.backLink}>
          <FiArrowLeft />
          <span>Back to Shopping Cart</span>
        </Link>
        <h1 className={styles.title}>Checkout & Delivery</h1>
        <p className={styles.subtitle}>
          Please enter your delivery destination details to finalize your order.
        </p>
      </header>

      {/* Two Column Layout: Delivery Form (Left) + Order Summary & Payment (Right) */}
      <div className={styles.orderLayout}>
        {/* Left Column: Delivery Address Form */}
        <form onSubmit={handlePlaceOrder} className={styles.deliveryFormCard} noValidate>
          <div className={styles.sectionHeader}>
            <FiTruck className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Delivery Information</h2>
          </div>

          <div className={styles.formFields}>
            {/* First Name & Last Name */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.formLabel}>
                  First Name *
                </label>
                <div className={`${styles.inputWrapper} ${errors.firstName ? styles.hasError : ''}`}>
                  <FiUser className={styles.inputIcon} aria-hidden="true" />
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className={styles.formInput}
                    required
                  />
                </div>
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.formLabel}>
                  Last Name *
                </label>
                <div className={`${styles.inputWrapper} ${errors.lastName ? styles.hasError : ''}`}>
                  <FiUser className={styles.inputIcon} aria-hidden="true" />
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={styles.formInput}
                    required
                  />
                </div>
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </div>
            </div>

            {/* Email Address */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email Address *
              </label>
              <div className={`${styles.inputWrapper} ${errors.email ? styles.hasError : ''}`}>
                <FiMail className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  className={styles.formInput}
                  required
                />
              </div>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            {/* Street Address */}
            <div className={styles.formGroup}>
              <label htmlFor="street" className={styles.formLabel}>
                Street Address / Apartment *
              </label>
              <div className={`${styles.inputWrapper} ${errors.street ? styles.hasError : ''}`}>
                <FiMapPin className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="street"
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="123 Galle Road, Apt 4B"
                  className={styles.formInput}
                  required
                />
              </div>
              {errors.street && <span className={styles.errorText}>{errors.street}</span>}
            </div>

            {/* City & State */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.formLabel}>
                  City *
                </label>
                <div className={`${styles.inputWrapper} ${errors.city ? styles.hasError : ''}`}>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Colombo"
                    className={styles.formInput}
                    required
                  />
                </div>
                {errors.city && <span className={styles.errorText}>{errors.city}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state" className={styles.formLabel}>
                  State / Province *
                </label>
                <div className={`${styles.inputWrapper} ${errors.state ? styles.hasError : ''}`}>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Western Province"
                    className={styles.formInput}
                    required
                  />
                </div>
                {errors.state && <span className={styles.errorText}>{errors.state}</span>}
              </div>
            </div>

            {/* Zip Code & Country */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="zipCode" className={styles.formLabel}>
                  Postal / Zip Code *
                </label>
                <div className={`${styles.inputWrapper} ${errors.zipCode ? styles.hasError : ''}`}>
                  <input
                    id="zipCode"
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="00300"
                    className={styles.formInput}
                    required
                  />
                </div>
                {errors.zipCode && <span className={styles.errorText}>{errors.zipCode}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.formLabel}>
                  Country *
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
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>
                Phone Number *
              </label>
              <div className={`${styles.inputWrapper} ${errors.phone ? styles.hasError : ''}`}>
                <FiPhone className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+94 77 123 4567"
                  className={styles.formInput}
                  required
                />
              </div>
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
          </div>
        </form>

        {/* Right Column: Order Summary & Payment Selection */}
        <aside className={styles.orderSidebar} aria-label="Order summary and payment section">
          {/* Order Summary Component */}
          <OrderSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            currency="$"
            showPromoInput={false}
            buttonText={paymentMethod === 'cod' ? 'CONFIRM CASH ON DELIVERY' : 'PROCEED TO PAYMENT'}
            onCheckout={handlePlaceOrder}
          />

          {/* Payment Method Selector */}
          <div className={styles.paymentMethodSection}>
            <h3 className={styles.paymentTitle}>Payment Method</h3>
            <div className={styles.paymentOptions}>
              {/* Stripe Online Card */}
              <label
                className={`${styles.paymentCard} ${paymentMethod === 'stripe' ? styles.selected : ''}`}
                onClick={() => setPaymentMethod('stripe')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className={styles.paymentRadio}
                />
                <FiCreditCard className={styles.sectionIcon} />
                <div className={styles.paymentLabel}>
                  <span className={styles.paymentName}>Online Card Payment</span>
                  <span className={styles.paymentDesc}>Pay securely with Stripe (Visa / Mastercard)</span>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                className={`${styles.paymentCard} ${paymentMethod === 'cod' ? styles.selected : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className={styles.paymentRadio}
                />
                <FiDollarSign className={styles.sectionIcon} />
                <div className={styles.paymentLabel}>
                  <span className={styles.paymentName}>Cash on Delivery (COD)</span>
                  <span className={styles.paymentDesc}>Pay in cash when meals arrive at your door</span>
                </div>
              </label>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className={styles.trustBadges}>
            <div className={styles.trustItem}>
              <FiShield className={styles.trustIcon} />
              <span>SSL Secure Checkout</span>
            </div>
            <div className={styles.trustItem}>
              <FiTruck className={styles.trustIcon} />
              <span>Express Delivery</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
