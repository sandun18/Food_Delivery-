import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import {
  FiPieChart,
  FiPlusCircle,
  FiList,
  FiPackage,
  FiExternalLink,
  FiMenu,
  FiX
} from 'react-icons/fi';
import styles from './AdminLayout.module.css';

/**
 * Admin Panel Master Layout
 * Shared navigation shell for Dashboard, Add Food, List Food, and Manage Orders
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.adminContainer}>
      {/* 1. Admin Top Header */}
      <header className={styles.adminHeader}>
        <div className={styles.brandGroup}>
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle admin sidebar"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <Link to="/admin">
            <img src={assets.logo} alt="Foodies Logo" className={styles.logo} />
          </Link>
          <span className={styles.adminBadge}>Admin Portal</span>
        </div>

        <div className={styles.headerActions}>
          <Link to="/" className={styles.storeLinkBtn} title="View customer-facing storefront">
            <span>Customer Store</span>
            <FiExternalLink />
          </Link>
          <div className={styles.adminProfile}>
            <img
              src={assets.profile_image}
              alt="Admin Profile"
              className={styles.profileAvatar}
            />
          </div>
        </div>
      </header>

      {/* 2. Admin Body (Sidebar + Content Outlet) */}
      <div className={styles.adminBody}>
        {/* Sidebar Navigation */}
        <aside
          className={`${styles.adminSidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
          aria-label="Admin navigation"
        >
          <span className={styles.navSectionLabel}>Analytics</span>
          <NavLink
            to="/admin/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${styles.sidebarLink} ${isActive ? styles.active : ''}`
            }
          >
            <FiPieChart className={styles.linkIcon} />
            <span>Dashboard</span>
          </NavLink>

          <span className={styles.navSectionLabel}>Menu Management</span>
          <NavLink
            to="/admin/add"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${styles.sidebarLink} ${isActive ? styles.active : ''}`
            }
          >
            <FiPlusCircle className={styles.linkIcon} />
            <span>Add Items</span>
          </NavLink>

          <NavLink
            to="/admin/list"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${styles.sidebarLink} ${isActive ? styles.active : ''}`
            }
          >
            <FiList className={styles.linkIcon} />
            <span>List Items</span>
          </NavLink>

          <span className={styles.navSectionLabel}>Operations</span>
          <NavLink
            to="/admin/orders"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${styles.sidebarLink} ${isActive ? styles.active : ''}`
            }
          >
            <FiPackage className={styles.linkIcon} />
            <span>Orders</span>
          </NavLink>
        </aside>

        {/* Main Routed Content Area */}
        <main className={styles.adminContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
