import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FiShoppingBag, FiSearch, FiLogOut, FiUser } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import styles from './Navbar.module.css';

/**
 * Main Navigation Bar Component
 */
export default function Navbar() {
  const [menu, setMenu] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalCartCount, token, setToken } = useAppContext();

  const cartCount = getTotalCartCount ? getTotalCartCount() : 0;

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

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
          <span className={styles.cartDot}>{cartCount}</span>
        </Link>

        {!token ? (
          <Link to="/signin">
            <button className={styles.signInBtn}>Sign In</button>
          </Link>
        ) : (
          <div className={styles.navbarProfile}>
            <img src={assets.profile_image} alt="User Profile" className={styles.profileIcon} />
            <div className={styles.navProfileDropdown}>
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem} onClick={() => navigate('/myorders')}>
                  <FiShoppingBag className={styles.itemIcon} />
                  <span>Orders</span>
                </li>
                <li className={styles.dropdownItem} onClick={() => navigate('/profile')}>
                  <FiUser className={styles.itemIcon} />
                  <span>Profile</span>
                </li>
                <hr className={styles.dropdownDivider} />
                <li className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={logout}>
                  <FiLogOut className={styles.itemIcon} />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
