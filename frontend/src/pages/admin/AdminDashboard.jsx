import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiLayers,
  FiRefreshCw,
  FiLoader,
  FiPlusCircle,
  FiList,
  FiArrowRight,
  FiPackage
} from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { url, token } = useAppContext();

  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Metrics from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/admin/metrics`, {
        headers: {
          token,
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.success) {
        setMetrics(response.data.metrics);
        setRecentOrders(response.data.recentOrders || []);
      } else {
        toast.error(response.data?.message || 'Failed to load dashboard metrics');
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      toast.error('Unable to fetch dashboard metrics. Please check admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Food Processing':
        return `${styles.badge} ${styles.badgeProcessing}`;
      case 'Out for Delivery':
        return `${styles.badge} ${styles.badgeOut}`;
      case 'Delivered':
        return `${styles.badge} ${styles.badgeDelivered}`;
      case 'Cancelled':
        return `${styles.badge} ${styles.badgeCancelled}`;
      default:
        return styles.badge;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Admin Analytics Dashboard</h1>
          <p className={styles.subtitle}>
            Live operational intelligence, revenue analytics, and real-time order tracking.
          </p>
        </div>

        <button
          type="button"
          className={styles.refreshBtn}
          onClick={fetchDashboardData}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? styles.spinner : ''} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingBox}>
          <FiLoader className={styles.spinner} />
          <span>Aggregating store metrics...</span>
        </div>
      ) : (
        <>
          {/* Top 4 KPI Metrics Grid */}
          <div className={styles.metricsGrid}>
            {/* 1. Total Revenue */}
            <div className={styles.metricCard}>
              <div
                className={styles.iconCircle}
                style={{ background: '#ecfdf5', color: '#059669' }}
              >
                <FiDollarSign />
              </div>
              <div className={styles.metricInfo}>
                <span className={styles.metricLabel}>Total Revenue</span>
                <span className={styles.metricValue}>
                  Rs. {Number(metrics?.totalRevenue || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* 2. Total Orders */}
            <div className={styles.metricCard}>
              <div
                className={styles.iconCircle}
                style={{ background: '#eff6ff', color: '#2563eb' }}
              >
                <FiShoppingBag />
              </div>
              <div className={styles.metricInfo}>
                <span className={styles.metricLabel}>Total Orders</span>
                <span className={styles.metricValue}>{metrics?.totalOrders || 0}</span>
              </div>
            </div>

            {/* 3. Active Users */}
            <div className={styles.metricCard}>
              <div
                className={styles.iconCircle}
                style={{ background: '#f5f3ff', color: '#7c3aed' }}
              >
                <FiUsers />
              </div>
              <div className={styles.metricInfo}>
                <span className={styles.metricLabel}>Registered Customers</span>
                <span className={styles.metricValue}>{metrics?.totalUsers || 0}</span>
              </div>
            </div>

            {/* 4. Total Dishes */}
            <div className={styles.metricCard}>
              <div
                className={styles.iconCircle}
                style={{ background: '#fff7ed', color: '#ea580c' }}
              >
                <FiLayers />
              </div>
              <div className={styles.metricInfo}>
                <span className={styles.metricLabel}>Dishes in Catalog</span>
                <span className={styles.metricValue}>{metrics?.totalFoodItems || 0}</span>
              </div>
            </div>
          </div>

          {/* Real-time Order Status Breakdown */}
          <div className={styles.statusBreakdownCard}>
            <h2 className={styles.sectionHeading}>Order Pipeline Status</h2>
            <div className={styles.statusGrid}>
              <div
                className={styles.statusBox}
                style={{ background: '#fff7ed', color: '#c2410c' }}
              >
                <span className={styles.statusBoxTitle}>Food Processing</span>
                <span className={styles.statusBoxCount}>
                  {metrics?.statusCounts?.foodProcessing || 0}
                </span>
              </div>

              <div
                className={styles.statusBox}
                style={{ background: '#eff6ff', color: '#1d4ed8' }}
              >
                <span className={styles.statusBoxTitle}>Out for Delivery</span>
                <span className={styles.statusBoxCount}>
                  {metrics?.statusCounts?.outForDelivery || 0}
                </span>
              </div>

              <div
                className={styles.statusBox}
                style={{ background: '#f0fdf4', color: '#15803d' }}
              >
                <span className={styles.statusBoxTitle}>Delivered</span>
                <span className={styles.statusBoxCount}>
                  {metrics?.statusCounts?.delivered || 0}
                </span>
              </div>

              <div
                className={styles.statusBox}
                style={{ background: '#fef2f2', color: '#b91c1c' }}
              >
                <span className={styles.statusBoxTitle}>Cancelled</span>
                <span className={styles.statusBoxCount}>
                  {metrics?.statusCounts?.cancelled || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Lower Grid: Recent Orders Feed + Quick Management Actions */}
          <div className={styles.dashboardGrid}>
            {/* Recent Orders List */}
            <div className={styles.card}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}
              >
                <h2 className={styles.sectionHeading} style={{ margin: 0 }}>
                  Recent Orders
                </h2>
                <Link
                  to="/admin/orders"
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#ff5722',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  View All Orders <FiArrowRight />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
                  No orders placed yet.
                </p>
              ) : (
                <table className={styles.recentTable}>
                  <thead>
                    <tr>
                      <th className={styles.recentTh}>Order ID</th>
                      <th className={styles.recentTh}>Customer</th>
                      <th className={styles.recentTh}>Status</th>
                      <th className={styles.recentTh} style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const id = order._id || order.id;
                      const name = order.address
                        ? `${order.address.firstName || ''} ${order.address.lastName || ''}`.trim() || 'Customer'
                        : 'Customer';

                      return (
                        <tr key={id}>
                          <td className={styles.recentTd} style={{ fontWeight: 700 }}>
                            #{String(id).slice(-6).toUpperCase()}
                          </td>
                          <td className={styles.recentTd}>{name}</td>
                          <td className={styles.recentTd}>
                            <span className={getStatusBadge(order.status)}>
                              {order.status}
                            </span>
                          </td>
                          <td
                            className={styles.recentTd}
                            style={{ textAlign: 'right', fontWeight: 700 }}
                          >
                            Rs. {Number(order.amount).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className={styles.card}>
              <h2 className={styles.sectionHeading}>Management Shortcuts</h2>
              <div className={styles.quickActionsList}>
                <Link to="/admin/add" className={styles.quickActionItem}>
                  <FiPlusCircle className={styles.actionIcon} />
                  <div>
                    <div>Add New Food Item</div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                      Upload photos, set prices and details
                    </span>
                  </div>
                </Link>

                <Link to="/admin/list" className={styles.quickActionItem}>
                  <FiList className={styles.actionIcon} />
                  <div>
                    <div>Food Menu Catalog</div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                      Inspect all active dishes and modify
                    </span>
                  </div>
                </Link>

                <Link to="/admin/orders" className={styles.quickActionItem}>
                  <FiPackage className={styles.actionIcon} />
                  <div>
                    <div>Manage All Orders</div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                      Update order and delivery tracking
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
