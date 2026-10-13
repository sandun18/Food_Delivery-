import React from 'react';
import Button from './Button';
import styles from './Hero.module.css';

/**
 * Hero Banner Section Component
 * Eye-catching promotional header banner with "Order your favorite food here" tagline
 * and smooth scroll CTA to explore menu
 * 
 * @param {Object} props
 * @param {Function} [props.onExploreClick] - Optional override click handler for CTA button
 */
export default function Hero({ onExploreClick }) {
  const scrollToMenu = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const menuSection =
      document.getElementById('explore-menu') ||
      document.getElementById('menu') ||
      document.querySelector('[data-section="menu"]');

    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = '#explore-menu';
    }
  };

  return (
    <section className={styles.hero} aria-label="Hero Banner">
      <div className={styles.heroOverlay} />
      <div className={styles.heroContents}>
        <div className={styles.badgePill}>
          <span className={styles.badgePulse} />
          <span>Craving Something Delicious?</span>
        </div>
        <h1 className={styles.heroTitle}>Order your favorite food here</h1>
        <p className={styles.heroText}>
          Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
        </p>
        <div className={styles.ctaGroup}>
          <Button
            variant="primary"
            size="lg"
            className={styles.ctaButton}
            onClick={scrollToMenu}
          >
            View Menu
          </Button>
        </div>
      </div>
    </section>
  );
}
