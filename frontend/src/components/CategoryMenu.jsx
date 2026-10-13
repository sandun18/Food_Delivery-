import React, { useRef } from 'react';
import { menu_list } from '../data/categories';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './CategoryMenu.module.css';

/**
 * Category Menu Selector Component
 * Allows horizontal browsing and filtering of food categories
 * 
 * @param {Object} props
 * @param {string} props.category - Active selected category (e.g., 'All', 'Salad', etc.)
 * @param {Function} props.setCategory - State updater callback for selected category
 */
export default function CategoryMenu({ category = 'All', setCategory }) {
  const scrollContainerRef = useRef(null);

  const handleSelect = (categoryName) => {
    if (setCategory) {
      setCategory((prev) => (prev === categoryName ? 'All' : categoryName));
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.exploreMenu} id="explore-menu">
      <div className={styles.headerArea}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>Explore Our Menu</h2>
          <p className={styles.subtitle}>
            Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
          </p>
        </div>

        {/* Scroll Nav Controls */}
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.scrollBtn}
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            title="Scroll categories left"
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            className={styles.scrollBtn}
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            title="Scroll categories right"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Category Horizontal Scroll List */}
      <div className={styles.categoryList} ref={scrollContainerRef}>
        {/* 'All' Category Reset Pill */}
        <div
          className={`${styles.categoryItem} ${category === 'All' ? styles.active : ''}`}
          onClick={() => handleSelect('All')}
        >
          <div className={`${styles.imageWrapper} ${styles.allWrapper} ${category === 'All' ? styles.activeImage : ''}`}>
            <span className={styles.allIcon} role="img" aria-label="All dishes">🍽️</span>
          </div>
          <p className={styles.categoryName}>All</p>
        </div>

        {/* Individual Categories from menu_list */}
        {menu_list.map((item, index) => {
          const isSelected = category === item.menu_name;
          return (
            <div
              key={index}
              className={`${styles.categoryItem} ${isSelected ? styles.active : ''}`}
              onClick={() => handleSelect(item.menu_name)}
            >
              <div className={`${styles.imageWrapper} ${isSelected ? styles.activeImage : ''}`}>
                <img
                  src={item.menu_image}
                  alt={item.menu_name}
                  className={styles.categoryImage}
                  draggable="false"
                />
              </div>
              <p className={styles.categoryName}>{item.menu_name}</p>
            </div>
          );
        })}
      </div>

      <hr className={styles.divider} />
    </section>
  );
}
