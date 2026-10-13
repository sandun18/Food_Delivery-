import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import CategoryMenu from '../components/CategoryMenu';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';
import { FoodGridSkeleton } from '../components/Skeleton';
import { food_list as defaultFoodList } from '../data/food';
import { FiFilter, FiX, FiRefreshCw } from 'react-icons/fi';
import styles from './Menu.module.css';

/**
 * Full Menu Page
 * Displays live filtered responsive grid of food items based on category and search query
 */
export default function Menu() {
  const { food_list } = useAppContext();
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Use live backend foods if available, fallback to default dataset
  const allFoods = food_list && food_list.length > 0 ? food_list : defaultFoodList;

  // Filter foods by selected category and live search query
  const filteredFoods = allFoods.filter((item) => {
    const matchesCategory =
      category === 'All' ||
      item.category?.toLowerCase() === category.toLowerCase();

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.name?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Sort filtered results
  const sortedFoods = [...filteredFoods].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  const resetFilters = () => {
    setCategory('All');
    setSearchQuery('');
    setSortBy('default');
  };

  const hasActiveFilters = category !== 'All' || searchQuery.trim().length > 0;

  return (
    <div className={styles.menuPage}>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <span className={styles.badge}>Our Complete Collection</span>
          <h1 className={styles.title}>Explore Our Full Menu</h1>
          <p className={styles.subtitle}>
            Discover delicious handcrafted meals prepared with fresh ingredients and bursting with authentic flavor.
          </p>

          {/* Search Bar with Live Debounced Filter */}
          <div className={styles.searchContainer}>
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search by dish name or category (e.g. Pasta, Salad)..."
              showPreview={false}
              className={styles.menuSearchBar}
            />
          </div>
        </div>
      </header>

      {/* Category Horizontal Filter Carousel */}
      <CategoryMenu category={category} setCategory={setCategory} />

      {/* Filter Status & Controls Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterStatus}>
          <span className={styles.resultsCount}>
            Showing <strong>{sortedFoods.length}</strong> {sortedFoods.length === 1 ? 'dish' : 'dishes'}
          </span>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className={styles.activePills}>
              {category !== 'All' && (
                <span className={styles.pill}>
                  Category: {category}
                  <button
                    type="button"
                    onClick={() => setCategory('All')}
                    className={styles.removePill}
                    aria-label="Clear category filter"
                  >
                    <FiX />
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className={styles.pill}>
                  "{searchQuery.trim()}"
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={styles.removePill}
                    aria-label="Clear search query"
                  >
                    <FiX />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className={styles.resetLink}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Sort Controls */}
        <div className={styles.sortWrapper}>
          <label htmlFor="menu-sort" className={styles.sortLabel}>
            <FiFilter className={styles.sortIcon} />
            <span>Sort by:</span>
          </label>
          <select
            id="menu-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="default">Featured / Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Responsive Food Grid */}
      {sortedFoods.length > 0 ? (
        <section className={styles.foodGrid} aria-label="Food Items Grid">
          {sortedFoods.map((item) => (
            <FoodCard
              key={item._id || item.id}
              id={item._id || item.id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
              category={item.category}
            />
          ))}
        </section>
      ) : (
        /* Empty State */
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} role="img" aria-label="No dishes found">
            🍽️
          </div>
          <h3>No dishes found</h3>
          <p>
            We couldn't find any food items matching your current filters.
          </p>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={resetFilters}
          >
            <FiRefreshCw />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
