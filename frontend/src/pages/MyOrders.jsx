import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Button from '../components/Button';
import {
  FiPackage,
  FiRefreshCw,
  FiClock,
  FiMapPin,
  FiXCircle,
  FiCheckCircle,
  FiTruck,
  FiArrowRight,
  FiShoppingBag
} from 'react-icons/fi';
import styles from './MyOrders.module.css';

/**
 * My Orders History Page
 * Fetches all orders placed by the authenticated user via `POST /api/order/userorders`.
 * Displays dynamic live status badges (Food Processing, Out for Delivery, Delivered, Cancelled),
 * order summary details, delivery address, and provides order cancellation for eligible orders.
 */
export default function MyOrders() {
  const { url, token } = useAppContext();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // 1. Fetch user orders from API
  const fetchOrders = useCallback(
    async (isManualRefresh = false) => {
      if (!token) {
        setLoading(false);
        return;
      }

      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const response = await axios.post(
          `${url}/api/order/userorders`,
          {},
          {
            headers: {
              token,
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data && response.data.success) {
          const fetchedOrders = response.data.data || response.data.orders || [];
          setOrders(fetchedOrders);
          if (isManualRefresh) {
            toast.info('Orders status refreshed');
          }
        } else {
          toast.error(response.data?.message || 'Could not load order history');
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
        toast.error('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [url, token]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 2. Handle Cancel Order
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be reversed.'
    );
    if (!confirmCancel) return;

    setCancellingOrderId(orderId);
    try {
      const response = await axios.post(
        `${url}/api/order/cancel`,
        { orderId },
        {
          headers: {
            token,
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Order cancelled successfully');
        // Update local order status without full re-fetch
        setOrders((prev) =>
          prev.map((ord) =>
            ord._id === orderId ? { ...ord, status: 'Cancelled' } : ord
          )
        );
      } else {
        toast.error(response.data?.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      const errMsg = error.response?.data?.message || 'Failed to cancel order';
      toast.error(errMsg);
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Helper for Status Badge Rendering
  const renderStatusBadge = (status) => {
    const normalizedStatus = (status || '').toLowerCase();

    if (normalizedStatus === 'food processing') {
      return (
        <span className={`${styles.statusBadge} ${styles.badgeProcessing}`}>
          <span className={`${styles.statusDot} ${styles.pulseDot}`} />
          Food Processing
        </span>
      );
    }

    if (normalizedStatus === 'out for delivery') {
      return (
        <span className={`${styles.statusBadge} ${styles.badgeDelivering}`}>
          <FiTruck />
          Out for Delivery
        </span>
      );
    }

    if (normalizedStatus === 'delivered') {
      return (
        <span className={`${styles.statusBadge} ${styles.badgeDelivered}`}>
          <FiCheckCircle />
          Delivered
        </span>
      );
    }

    if (normalizedStatus === 'cancelled') {
      return (
        <span className={`${styles.statusBadge} ${styles.badgeCancelled}`}>
          <FiXCircle />
          Cancelled
        </span>
      );
    }

    // Default fallback
    return (
      <span className={`${styles.statusBadge} ${styles.badgeProcessing}`}>
        <span className={styles.statusDot} />
        {status}
      </span>
    );
  };

  // 3. Render unauthenticated state
  if (!token) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <FiShoppingBag />
          </div>
          <h2 className={styles.emptyTitle}>Sign In to View Orders</h2>
          <p className={styles.subtitle}>
            Please sign in to your account to view your past and active food delivery orders.
          </p>
          <Button variant="primary" onClick={() => navigate('/signin', { state: { from: { pathname: '/myorders' } } })}>
            <span>Sign In Now</span>
            <FiArrowRight style={{ marginLeft: 6 }} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.headerTitle}>
            <FiPackage />
            <span>My Orders</span>
          </h1>
          <p className={styles.headerSubtitle}>
            Track real-time delivery status and view your order receipts
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => fetchOrders(true)}
            disabled={refreshing || loading}
            aria-label="Refresh orders"
          >
            <FiRefreshCw className={refreshing ? styles.spinning : ''} />
            <span>{refreshing ? 'Updating...' : 'Track Orders'}</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className={styles.loadingGrid}>
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <FiPackage />
          </div>
          <h2 className={styles.emptyTitle}>No Orders Yet</h2>
          <p className={styles.emptySubtitle}>
            You haven't placed any food orders yet. Explore our delicious dishes and satisfy your cravings today!
          </p>
          <Link to="/menu">
            <Button variant="primary">
              <FiShoppingBag style={{ marginRight: 6 }} />
              <span>Explore Food Menu</span>
            </Button>
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className={styles.ordersList}>
          {orders.map((order) => {
            const itemCount = (order.items || []).reduce(
              (acc, curr) => acc + (Number(curr.quantity) || 1),
              0
            );

            const itemsString = (order.items || [])
              .map((it) => `${it.name} x ${it.quantity || 1}`)
              .join(', ');

            const orderDate = new Date(order.date || order.createdAt || Date.now()).toLocaleDateString(
              undefined,
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }
            );

            const isCancellable = order.status === 'Food Processing';
            const isCancellingThis = cancellingOrderId === order._id;

            return (
              <article key={order._id} className={styles.orderCard}>
                {/* Top Meta Bar */}
                <div className={styles.orderTopBar}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderId} title={`Order ID: ${order._id}`}>
                      #{String(order._id).slice(-8).toUpperCase()}
                    </span>
                    <span className={styles.orderDate}>
                      <FiClock />
                      {orderDate}
                    </span>
                  </div>
                  <div>{renderStatusBadge(order.status)}</div>
                </div>

                {/* Main Body */}
                <div className={styles.orderBody}>
                  {/* Parcel Graphic */}
                  <div className={styles.parcelGraphic}>
                    <img
                      src={assets.parcel_icon}
                      alt="Order Parcel"
                      className={styles.parcelImg}
                    />
                  </div>

                  {/* Items Description */}
                  <div className={styles.itemsSummary}>
                    <p className={styles.itemsList} title={itemsString}>
                      {itemsString}
                    </p>
                    <div className={styles.itemsSub}>
                      <span className={styles.paymentTag}>
                        {order.paymentMethod === 'COD'
                          ? 'Cash on Delivery'
                          : 'Online Payment (Card)'}
                      </span>
                      <span
                        style={{
                          color: order.payment ? '#059669' : '#d97706',
                          fontWeight: 600,
                          fontSize: '12.5px'
                        }}
                      >
                        {order.payment ? '• Paid' : '• Payment Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className={styles.orderPricing}>
                    <span className={styles.totalAmount}>${Number(order.amount).toFixed(2)}</span>
                    <span className={styles.itemsCount}>
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Bottom Bar: Address & Actions */}
                <div className={styles.orderBottomBar}>
                  <div className={styles.deliveryAddress}>
                    <FiMapPin />
                    <span>
                      {order.address?.street
                        ? `${order.address.street}, ${order.address.city || ''}`
                        : 'Delivery address specified at checkout'}
                    </span>
                  </div>

                  <div className={styles.orderActions}>
                    {/* Cancel Button (only for Food Processing) */}
                    {isCancellable && (
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={isCancellingThis}
                      >
                        <FiXCircle />
                        <span>{isCancellingThis ? 'Cancelling...' : 'Cancel Order'}</span>
                      </button>
                    )}

                    {/* Track Order / Refresh button */}
                    <button
                      type="button"
                      className={styles.trackBtn}
                      onClick={() => fetchOrders(true)}
                      disabled={refreshing}
                    >
                      <FiRefreshCw className={refreshing ? styles.spinning : ''} />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
