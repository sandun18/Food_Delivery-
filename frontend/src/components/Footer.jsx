import React from 'react';
import { assets } from '../assets/assets';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import styles from './Footer.module.css';

/**
 * Responsive Footer Component
 */
export default function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.footerContent}>
        {/* Left Section: Brand & About */}
        <div className={styles.footerContentLeft}>
          <img src={assets.logo} alt="Foodies Logo" className={styles.footerLogo} />
          <p>
            Craving something delicious? We deliver hot, fresh, and chef-crafted meals straight to your doorstep within minutes. Quality food, fast delivery, and exceptional taste guaranteed.
          </p>
          <div className={styles.socialIcons}>
            <div className={styles.socialIcon} aria-label="Facebook">
              <FaFacebookF />
            </div>
            <div className={styles.socialIcon} aria-label="Twitter">
              <FaTwitter />
            </div>
            <div className={styles.socialIcon} aria-label="LinkedIn">
              <FaLinkedinIn />
            </div>
          </div>
        </div>

        {/* Center Section: Navigation Links */}
        <div className={styles.footerContentCenter}>
          <h3>COMPANY</h3>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery Info</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Right Section: Contact & Support */}
        <div className={styles.footerContentRight}>
          <h3>GET IN TOUCH</h3>
          <ul>
            <li>+94 11 234 5678</li>
            <li>support@foodies.com</li>
            <li>Colombo, Sri Lanka</li>
          </ul>
        </div>
      </div>

      <div className={styles.divider}></div>
      <p className={styles.copyright}>
        Copyright © {new Date().getFullYear()} Foodies.com - All Rights Reserved.
      </p>
    </footer>
  );
}
