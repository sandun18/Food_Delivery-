import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { FiCheckCircle, FiAlertCircle, FiArrowRight, FiRotateCcw } from 'react-icons/fi';
import styles from './Verify.module.css';

/**
 * Stripe Payment Verification Page
 * Reads `orderId` and `success` query parameters from the Stripe redirect URL,
 * calls `POST /api/order/verify` to confirm order status, clears cart,
 * and seamlessly redirects the user to My Orders or Cart.
 */
export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url, token, clearCart } = useAppContext();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  // State: 'loading' | 'success' | 'failed'
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your payment with Stripe...');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      if (!orderId) {
        setStatus('failed');
        setMessage('Invalid verification request. No order ID provided.');
        toast.error('Invalid payment verification parameters');
        return;
      }

      try {
        const response = await axios.post(
          `${url}/api/order/verify`,
          { orderId, success },
          {
            headers: token ? { token, Authorization: `Bearer ${token}` } : {}
          }
        );

        if (response.data && response.data.success) {
          setStatus('success');
          setMessage('Payment verified successfully! Your food order has been placed.');
          if (clearCart) clearCart();
          toast.success('Payment successful! Order placed.');

          // Redirect to orders after 2 seconds
          setTimeout(() => {
            navigate('/myorders');
          }, 2000);
        } else {
          setStatus('failed');
          setMessage(response.data?.message || 'Payment was cancelled or could not be completed.');
          toast.error(response.data?.message || 'Payment cancelled. Order removed.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        const errMsg = error.response?.data?.message || 'Failed to verify payment. Please contact support.';
        setMessage(errMsg);
        toast.error(errMsg);
      }
    };

    verifyPayment();
  }, [orderId, success, url, token, clearCart, navigate]);

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyCard}>
        {status === 'loading' && (
          <>
            <div className={`${styles.iconWrapper} ${styles.loading}`}>
              <div className={styles.spinner} />
            </div>
            <h2 className={styles.title}>Verifying Payment</h2>
            <p className={styles.description}>
              Please wait while we confirm your transaction with Stripe. Do not refresh or close this tab.
            </p>
            {orderId && <div className={styles.metaBox}>Order Reference: {orderId}</div>}
          </>
        )}

        {status === 'success' && (
          <>
            <div className={`${styles.iconWrapper} ${styles.success}`}>
              <FiCheckCircle className={styles.statusIcon} />
            </div>
            <h2 className={styles.title}>Payment Successful!</h2>
            <p className={styles.description}>{message}</p>
            {orderId && <div className={styles.metaBox}>Order Reference: {orderId}</div>}
            <div className={styles.actionButtons}>
              <Button
                variant="primary"
                onClick={() => navigate('/myorders')}
              >
                <span>View My Orders</span>
                <FiArrowRight style={{ marginLeft: 6 }} />
              </Button>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className={`${styles.iconWrapper} ${styles.error}`}>
              <FiAlertCircle className={styles.statusIcon} />
            </div>
            <h2 className={styles.title}>Payment Unsuccessful</h2>
            <p className={styles.description}>{message}</p>
            {orderId && <div className={styles.metaBox}>Order Reference: {orderId}</div>}
            <div className={styles.actionButtons}>
              <Link to="/cart">
                <Button variant="secondary">
                  <FiRotateCcw style={{ marginRight: 6 }} />
                  <span>Return to Cart</span>
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="primary">
                  <span>Browse Menu</span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
