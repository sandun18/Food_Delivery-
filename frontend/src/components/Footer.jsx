import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './Footer.module.css';

/**
 * Responsive Footer Component
 * Features company details, quick navigation links, social icons, contact info, and copyright note
 */
export default function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.footerContent}>
        {/* Left Section: Brand & About */}
        <div className={styles.footerContentLeft}>
          <Link to="/">
            <img src={assets.logo} alt="Foodies Logo" className={styles.footerLogo} />
          </Link>
          <p>
            Craving something delicious? We deliver hot, fresh, and chef-crafted meals straight to your doorstep within minutes. Quality food, fast delivery, and exceptional taste guaranteed.
          </p>
          <div className={styles.socialIcons}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Center Section: Quick Links */}
        <div className={styles.footerContentCenter}>
          <h3>QUICK LINKS</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <a href="#app-download">Mobile App</a>
            </li>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Right Section: Contact & Support */}
        <div className={styles.footerContentRight}>
          <h3>GET IN TOUCH</h3>
          <ul>
            <li>
              <a href="tel:+94112345678" className={styles.contactItem}>
                <FaPhoneAlt className={styles.contactIcon} />
                <span>+94 11 234 5678</span>
              </a>
            </li>
            <li>
              <a href="tel:+94771234567" className={styles.contactItem}>
                <FaPhoneAlt className={styles.contactIcon} />
                <span>+94 77 123 4567</span>
              </a>
            </li>
            <li>
              <a href="mailto:support@foodies.com" className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />
                <span>support@foodies.com</span>
              </a>
            </li>
            <li className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>Colombo, Sri Lanka</span>
            </li>
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
