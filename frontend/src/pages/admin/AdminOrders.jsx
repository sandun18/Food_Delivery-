import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPackage, FiLoader, FiRefreshCw, FiClock, FiMapPin, FiPhone } from 'react-icons/fi';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import styles from './AdminOrders.module.css';

const STATUS_OPTIONS = [
  'Food Processing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export default function AdminOrders() {
  const { url, token } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all customer orders from backend
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/order/list`, {
        headers: {
          token,
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.success) {
        setOrders(response.data.data || response.data.orders || []);
      } else {
        toast.error(response.data?.message || 'Failed to retrieve orders');
      }
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      toast.error('Unable to fetch orders. Please ensure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllOrders();
    }
  }, [token]);

  // Update order status handler
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await axios.post(
        `${url}/api/order/status`,
        { orderId, status: newStatus },
        {
          headers: {
            token,
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {
        toast.success(`Order status updated to "${newStatus}"`);
        setOrders((prev) =>
          prev.map((order) =>
            (order._id || order.id) === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(response.data?.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Server error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper for dynamic status CSS class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Food Processing':
        return styles.statusProcessing;
      case 'Out for Delivery':
        return styles.statusOutForDelivery;
      case 'Delivered':
        return styles.statusDelivered;
      case 'Cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  // Filter orders by status tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'All') return true;
    return order.status?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className={styles.container}>
      {/* Header and Controls */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Customer Order Management</h1>
          <p className={styles.subtitle}>
            Review customer orders, monitor payment statuses, and update live delivery tracking ({orders.length} orders total).
          </p>
        </div>

        <button
          type="button"
          className={styles.refreshBtn}
          onClick={fetchAllOrders}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? styles.spinner : ''} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className={styles.tabs}>
        {['All', 'Food Processing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List Content */}
      {loading ? (
        <div className={styles.loadingBox}>
          <FiLoader className={styles.spinner} />
          <span>Loading customer orders...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={styles.emptyCard}>
          <FiPackage className={styles.emptyIcon} />
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            No Orders Found
          </h3>
          <p style={{ fontSize: '13.5px', color: '#94a3b8' }}>
            {activeTab === 'All'
              ? 'No customer orders have been placed yet.'
              : `There are currently no orders in "${activeTab}" status.`}
          </p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {filteredOrders.map((order) => {
            const orderId = order._id || order.id;
            const address = order.address || {};
            const items = order.items || [];
            const formattedDate = order.date
              ? new Date(order.date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Recent';

            return (
              <div key={orderId} className={styles.orderCard}>
                {/* 1. Icon Box */}
                <div className={styles.iconWrapper}>
                  <img
                    src={assets.parcel_icon || '/parcel_icon.png'}
                    alt="Parcel"
                    className={styles.parcelIcon}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                {/* 2. Items & Date */}
                <div className={styles.itemsCol}>
                  <span className={styles.orderId}>ORDER #{String(orderId).slice(-6).toUpperCase()}</span>
                  <div className={styles.itemsSummary}>
                    {items.map((item, idx) => (
                      <span key={idx}>
                        {item.name} x {item.quantity || 1}
                        {idx < items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <span className={styles.dateText}>
                    <FiClock style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    {formattedDate}
                  </span>
                </div>

                {/* 3. Customer Address */}
                <div className={styles.customerCol}>
                  <span className={styles.customerName}>
                    {address.firstName} {address.lastName}
                  </span>
                  <span>
                    <FiMapPin style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    {address.street ? `${address.street}, ` : ''}
                    {address.city ? `${address.city}, ` : ''}
                    {address.state || address.country || ''}
                  </span>
                  {address.phone && (
                    <span className={styles.phone}>
                      <FiPhone style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      {address.phone}
                    </span>
                  )}
                </div>

                {/* 4. Financial & Payment Summary */}
                <div className={styles.summaryCol}>
                  <span className={styles.itemCount}>Items: {items.length}</span>
                  <span className={styles.amount}>Rs. {Number(order.amount).toLocaleString()}</span>
                  <div className={styles.badgeRow}>
                    <span className={styles.methodBadge}>{order.paymentMethod || 'COD'}</span>
                    <span className={order.payment ? styles.paidBadge : styles.unpaidBadge}>
                      {order.payment ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>

                {/* 5. Status Selector */}
                <div className={styles.statusCol}>
                  <span className={styles.statusLabel}>Change Status</span>
                  <select
                    className={`${styles.statusSelect} ${getStatusClass(order.status)}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(orderId, e.target.value)}
                    disabled={updatingId === orderId}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
