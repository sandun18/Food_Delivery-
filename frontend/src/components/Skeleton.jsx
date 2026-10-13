import React from 'react';
import styles from './Skeleton.module.css';

/**
 * FoodCardSkeleton
 * Placeholder card displayed while food items are being fetched
 */
export const FoodCardSkeleton = () => {
  return (
    <div className={styles.foodCardSkeleton} aria-busy="true" aria-label="Loading food item">
      <div className={`${styles.imageSkeleton} ${styles.shimmer}`} />
      <div className={styles.contentSkeleton}>
        <div className={`${styles.titleSkeleton} ${styles.shimmer}`} />
        <div className={`${styles.descSkeleton1} ${styles.shimmer}`} />
        <div className={`${styles.descSkeleton2} ${styles.shimmer}`} />
        <div className={styles.bottomRowSkeleton}>
          <div className={`${styles.priceSkeleton} ${styles.shimmer}`} />
          <div className={`${styles.buttonSkeleton} ${styles.shimmer}`} />
        </div>
      </div>
    </div>
  );
};

/**
 * FoodGridSkeleton
 * Grid of FoodCardSkeletons
 */
export const FoodGridSkeleton = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <FoodCardSkeleton key={`skeleton-${idx}`} />
      ))}
    </>
  );
};

export default {
  FoodCardSkeleton,
  FoodGridSkeleton
};
