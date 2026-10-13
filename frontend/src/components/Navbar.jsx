import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import {
  FiShoppingBag,
  FiSearch,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
  FiHome,
  FiSmartphone,
  FiPhone,
  FiPackage
} from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import styles from './Navbar.module.css';

/**
 * Main Navigation Bar Component with Mobile Navigation Drawer
 */
export default function Navbar() {
  const [menu, setMenu] = useState('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalCartCount, token, setToken, user } = useAppContext();

  const cartCount = getTotalCartCount ? getTotalCartCount() : 0;

  // Sync menu state with current pathname
  useEffect(() => {
    if (location.pathname === '/') setMenu('home');
    else if (location.pathname === '/menu') setMenu('menu');
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [drawerOpen]);

  // Close drawer on navigation
  const handleNavClick = (sectionName) => {
    setMenu(sectionName);
    setDrawerOpen(false);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setDrawerOpen(false);
    navigate('/');
  };

  return (
    <header className={styles.navbar}>
      {/* Brand Logo */}
      <Link to="/" onClick={() => handleNavClick('home')}>
        <img src={assets.logo} alt="Foodies Logo" className={styles.logo} />
      </Link>

      {/* Desktop Navigation Links */}
      <nav className={styles.desktopNav}>
        <ul className={styles.navMenu}>
          <li>
            <Link
              to="/"
              onClick={() => handleNavClick('home')}
              className={`${styles.navLink} ${
                menu === 'home' || location.pathname === '/' ? styles.active : ''
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/menu"
              onClick={() => handleNavClick('menu')}
              className={`${styles.navLink} ${
                menu === 'menu' || location.pathname === '/menu' ? styles.active : ''
              }`}
            >
              Menu
            </Link>
          </li>
          <li>
            <a
              href="#app-download"
              onClick={() => handleNavClick('mobile-app')}
              className={`${styles.navLink} ${
                menu === 'mobile-app' ? styles.active : ''
              }`}
            >
              Mobile App
            </a>
          </li>
          <li>
            <a
              href="#footer"
              onClick={() => handleNavClick('contact-us')}
              className={`${styles.navLink} ${
                menu === 'contact-us' ? styles.active : ''
              }`}
            >
              Contact Us
            </a>
          </li>
        </ul>
      </nav>

      {/* Right Controls (Search, Cart Badge, Auth, Mobile Menu Toggle) */}
      <div className={styles.navRight}>
        <Link
          to="/menu"
          className={styles.searchIcon}
          title="Search food dishes"
          aria-label="Search food dishes"
        >
          <FiSearch />
        </Link>

        <Link
          to="/cart"
          className={styles.cartIconWrapper}
          title="View Cart"
          aria-label="Shopping Cart"
        >
          <FiShoppingBag />
          <span className={styles.cartDot}>{cartCount}</span>
        </Link>

        {/* Desktop Profile / Sign In */}
        {!token ? (
          <Link to="/signin" className={styles.desktopAuth}>
            <button className={styles.signInBtn}>Sign In</button>
          </Link>
        ) : (
          <div className={`${styles.navbarProfile} ${styles.desktopAuth}`}>
            <img
              src={assets.profile_image}
              alt="User Profile"
              className={styles.profileIcon}
            />
            <div className={styles.navProfileDropdown}>
              <ul className={styles.dropdownMenu}>
                <li
                  className={styles.dropdownItem}
                  onClick={() => navigate('/myorders')}
                >
                  <FiPackage className={styles.itemIcon} />
                  <span>Orders</span>
                </li>
                <li
                  className={styles.dropdownItem}
                  onClick={() => navigate('/profile')}
                >
                  <FiUser className={styles.itemIcon} />
                  <span>Profile</span>
                </li>
                <hr className={styles.dropdownDivider} />
                <li
                  className={`${styles.dropdownItem} ${styles.logoutItem}`}
                  onClick={logout}
                >
                  <FiLogOut className={styles.itemIcon} />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={styles.hamburgerBtn}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open mobile navigation drawer"
        >
          <FiMenu />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {drawerOpen && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <aside
        className={`${styles.mobileDrawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-label="Mobile Navigation"
      >
        <div className={styles.drawerHeader}>
          <img src={assets.logo} alt="Foodies Logo" className={styles.drawerLogo} />
          <button
            type="button"
            className={styles.closeDrawerBtn}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu drawer"
          >
            <FiX />
          </button>
        </div>

        {/* User Info Bar if Logged In */}
        {token && (
          <div className={styles.drawerUserCard}>
            <img
              src={assets.profile_image}
              alt="Profile"
              className={styles.drawerUserAvatar}
            />
            <div className={styles.drawerUserInfo}>
              <span className={styles.drawerUserName}>
                {user?.name || 'Foodie Member'}
              </span>
              <span className={styles.drawerUserEmail}>
                {user?.email || 'Logged in'}
              </span>
            </div>
          </div>
        )}

        {/* Drawer Navigation Links */}
        <nav className={styles.drawerNav}>
          <Link
            to="/"
            onClick={() => handleNavClick('home')}
            className={`${styles.drawerNavItem} ${
              location.pathname === '/' ? styles.activeDrawerItem : ''
            }`}
          >
            <FiHome className={styles.drawerItemIcon} />
            <span>Home</span>
          </Link>

          <Link
            to="/menu"
            onClick={() => handleNavClick('menu')}
            className={`${styles.drawerNavItem} ${
              location.pathname === '/menu' ? styles.activeDrawerItem : ''
            }`}
          >
            <FiShoppingBag className={styles.drawerItemIcon} />
            <span>Menu & Explore</span>
          </Link>

          <a
            href="#app-download"
            onClick={() => handleNavClick('mobile-app')}
            className={styles.drawerNavItem}
          >
            <FiSmartphone className={styles.drawerItemIcon} />
            <span>Mobile App</span>
          </a>

          <a
            href="#footer"
            onClick={() => handleNavClick('contact-us')}
            className={styles.drawerNavItem}
          >
            <FiPhone className={styles.drawerItemIcon} />
            <span>Contact Us</span>
          </a>

          {/* Logged-in Links */}
          {token && (
            <>
              <div className={styles.drawerDivider} />
              <Link
                to="/myorders"
                onClick={() => setDrawerOpen(false)}
                className={`${styles.drawerNavItem} ${
                  location.pathname === '/myorders' ? styles.activeDrawerItem : ''
                }`}
              >
                <FiPackage className={styles.drawerItemIcon} />
                <span>My Orders</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setDrawerOpen(false)}
                className={`${styles.drawerNavItem} ${
                  location.pathname === '/profile' ? styles.activeDrawerItem : ''
                }`}
              >
                <FiUser className={styles.drawerItemIcon} />
                <span>My Profile</span>
              </Link>
            </>
          )}
        </nav>

        {/* Drawer Footer Actions */}
        <div className={styles.drawerFooter}>
          {token ? (
            <button
              type="button"
              className={styles.drawerLogoutBtn}
              onClick={logout}
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          ) : (
            <div className={styles.drawerAuthButtons}>
              <button
                type="button"
                className={styles.drawerSignInBtn}
                onClick={() => {
                  setDrawerOpen(false);
                  navigate('/signin');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={styles.drawerSignUpBtn}
                onClick={() => {
                  setDrawerOpen(false);
                  navigate('/signup');
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </aside>
    </header>
  );
}
