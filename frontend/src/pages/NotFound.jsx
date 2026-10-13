import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { FiHome, FiShoppingBag, FiPackage, FiHelpCircle } from 'react-icons/fi';
import styles from './NotFound.module.css';

/**
 * 404 Not Found Page
 * Displays user-friendly error message when hitting undefined routes,
 * accompanied by quick recovery links and CTA buttons.
 */
export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.contentWrapper}>
        <div className={styles.illustrationBadge}>
          <span className={styles.codeNumber}>404</span>
          <span className={styles.foodEmoji} role="img" aria-label="Donut">
            🍩
          </span>
        </div>

        <h1 className={styles.title}>Oops! This Dish Isn't on the Menu</h1>
        <p className={styles.description}>
          The page you are looking for might have been moved, removed, or doesn't exist. Let's get you back to discovering delicious food!
        </p>

        <div className={styles.actionGrid}>
          <Link to="/">
            <Button variant="primary">
              <FiHome style={{ marginRight: 6 }} />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link to="/menu">
            <Button variant="secondary">
              <FiShoppingBag style={{ marginRight: 6 }} />
              <span>Browse Full Menu</span>
            </Button>
          </Link>
        </div>

        <div className={styles.quickLinks}>
          <Link to="/cart" className={styles.quickLinkItem}>
            <FiShoppingBag />
            <span>Shopping Cart</span>
          </Link>
          <Link to="/myorders" className={styles.quickLinkItem}>
            <FiPackage />
            <span>My Orders</span>
          </Link>
          <a href="#footer" className={styles.quickLinkItem}>
            <FiHelpCircle />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
