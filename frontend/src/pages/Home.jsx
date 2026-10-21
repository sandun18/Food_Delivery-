import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { food_list as defaultFoodList } from '../data/food';
import { assets } from '../assets/assets';
import Hero from '../components/Hero';
import CategoryMenu from '../components/CategoryMenu';
import FoodCard from '../components/FoodCard';
import {
  FiArrowRight,
  FiTruck,
  FiShield,
  FiClock,
  FiSmile
} from 'react-icons/fi';
import styles from './Home.module.css';

/**
 * Modern Food Delivery Home Page
 * Unites Hero banner, horizontal Category Menu, dynamic Food Display with live cart controls,
 * Trust highlights, and App Download promotion
 */
export default function Home() {
  const { food_list } = useAppContext();
  const [category, setCategory] = useState('All');

  // Use live backend food items if available, falling back to rich static dataset
  const allFoods = food_list && food_list.length > 0 ? food_list : defaultFoodList;

  // Filter foods by selected category
  const filteredFoods = allFoods.filter((item) => {
    if (category === 'All') return true;
    return item.category?.toLowerCase() === category.toLowerCase();
  });

  return (
    <div className={styles.homeContainer}>
      {/* 1. Hero Promotional Banner */}
      <Hero />

      {/* 2. Interactive Horizontal Category Selector */}
      <CategoryMenu category={category} setCategory={setCategory} />

      {/* 3. Top Dishes Display Grid */}
      <section className={styles.foodDisplaySection} id="food-display">
        <div className={styles.foodDisplayHeader}>
          <div className={styles.titleArea}>
            <h2 className={styles.sectionTitle}>
              {category === 'All' ? 'Top Dishes Near You' : `${category} Specialties`}
            </h2>
            <p className={styles.sectionSubtitle}>
              Freshly prepared by top local chefs with premium quality ingredients ({filteredFoods.length} items available)
            </p>
          </div>

          <Link to="/menu" className={styles.viewAllBtn}>
            <span>View Full Menu</span>
            <FiArrowRight />
          </Link>
        </div>

        {filteredFoods.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>No dishes found in this category</h3>
            <p className={styles.emptyText}>
              Try selecting another category or browse our full menu.
            </p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => setCategory('All')}
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div className={styles.foodGrid}>
            {filteredFoods.map((item) => (
              <FoodCard key={item._id || item.id} food={item} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Why Choose Us / Trust Highlights */}
      <section className={styles.featuresSection} aria-label="Our Service Advantages">
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconBox} style={{ color: '#ff4c24' }}>
              <FiTruck />
            </div>
            <div className={styles.featureContent}>
              <h4>Fast Delivery</h4>
              <p>Hot and fresh meals delivered straight to your door in 30 minutes or less.</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox} style={{ color: '#10b981' }}>
              <FiShield />
            </div>
            <div className={styles.featureContent}>
              <h4>100% Quality Food</h4>
              <p>Handcrafted by certified culinary experts using clean, fresh ingredients.</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox} style={{ color: '#3b82f6' }}>
              <FiClock />
            </div>
            <div className={styles.featureContent}>
              <h4>Real-time Tracking</h4>
              <p>Stay informed every step of the way with live order progress tracking.</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox} style={{ color: '#f59e0b' }}>
              <FiSmile />
            </div>
            <div className={styles.featureContent}>
              <h4>Customer Support</h4>
              <p>Dedicated customer service team ready to assist your food orders 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mobile App Download Promotion */}
      <section className={styles.appDownloadSection} id="app-download">
        <h2 className={styles.appTitle}>
          For Better Experience Download Foodies App
        </h2>
        <p className={styles.appSubtitle}>
          Order faster, save delivery addresses, access exclusive discounts, and track your delivery rider in real time.
        </p>

        <div className={styles.platformsContainer}>
          <div
            className={styles.platformBadge}
            onClick={() => window.open('https://play.google.com', '_blank')}
            title="Download on Google Play Store"
          >
            <img src={assets.play_store} alt="Google Play Store" />
          </div>

          <div
            className={styles.platformBadge}
            onClick={() => window.open('https://apple.com/app-store', '_blank')}
            title="Download on Apple App Store"
          >
            <img src={assets.app_store} alt="Apple App Store" />
          </div>
        </div>
      </section>
    </div>
  );
}