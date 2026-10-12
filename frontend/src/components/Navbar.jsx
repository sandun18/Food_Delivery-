import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FiShoppingBag, FiSearch } from 'react-icons/fi';
import styles from './Navbar.module.css';

/**
 * Main Navigation Bar Component
 */
export default function Navbar() {
  const [menu, setMenu] = useState('home');
  const location = useLocation();

  return (
    <header className={styles.navbar}>
      {/* Brand Logo */}
      <Link to="/" onClick={() => setMenu('home')}>
        <img src={assets.logo} alt="Foodies Logo" className={styles.logo} />
      </Link>

      {/* Navigation Links */}
      <nav>
        <ul className={styles.navMenu}>
          <li>
            <Link
              to="/"
              onClick={() => setMenu('home')}
              className={`${styles.navLink} ${menu === 'home' || location.pathname === '/' ? styles.active : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/menu"
              onClick={() => setMenu('menu')}
              className={`${styles.navLink} ${menu === 'menu' || location.pathname === '/menu' ? styles.active : ''}`}
            >
              Menu
            </Link>
          </li>
          <li>
            <a
              href="#app-download"
              onClick={() => setMenu('mobile-app')}
              className={`${styles.navLink} ${menu === 'mobile-app' ? styles.active : ''}`}
            >
              Mobile App
            </a>
          </li>
          <li>
            <a
              href="#footer"
              onClick={() => setMenu('contact-us')}
              className={`${styles.navLink} ${menu === 'contact-us' ? styles.active : ''}`}
            >
              Contact Us
            </a>
          </li>
        </ul>
      </nav>

      {/* Right Controls (Search, Cart Badge, Auth) */}
      <div className={styles.navRight}>
        <div className={styles.searchIcon} title="Search food">
          <FiSearch />
        </div>

        <Link to="/cart" className={styles.cartIconWrapper} title="View Cart">
          <FiShoppingBag />
          <span className={styles.cartDot}>0</span>
        </Link>

        <Link to="/signin">
          <button className={styles.signInBtn}>Sign In</button>
        </Link>
      </div>
    </header>
  );
}
