import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import styles from './SearchBar.module.css';

/**
 * Debounced Live Search Bar Component
 * Filters food items by name or category with smooth debounced input
 * 
 * @param {Object} props
 * @param {string} [props.placeholder='Search delicious dishes or categories...']
 * @param {Function} [props.onSearch] - Callback invoked with debounced search query
 * @param {Function} [props.onSelectDish] - Callback when an item from live preview is clicked
 * @param {number} [props.debounceTime=300] - Milliseconds to delay search trigger
 * @param {boolean} [props.showPreview=true] - Whether to show live autocomplete dropdown
 * @param {string} [props.className=''] - Additional custom wrapper classes
 */
export default function SearchBar({
  placeholder = 'Search delicious food or category...',
  onSearch,
  onSelectDish,
  debounceTime = 300,
  showPreview = true,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { food_list, url, addToCart } = useAppContext();
  const searchContainerRef = useRef(null);

  // Debounce input updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      if (onSearch) {
        onSearch(searchTerm.trim());
      }
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceTime, onSearch]);

  // Close preview dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter matching foods by name or category
  const filteredFoods = debouncedTerm.trim()
    ? (food_list || []).filter((item) => {
        const query = debouncedTerm.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        return matchesName || matchesCategory;
      })
    : [];

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleClear = () => {
    setSearchTerm('');
    setDebouncedTerm('');
    setIsOpen(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const handleItemSelect = (item) => {
    setIsOpen(false);
    if (onSelectDish) {
      onSelectDish(item);
    }
  };

  return (
    <div className={`${styles.searchWrapper} ${className}`} ref={searchContainerRef}>
      <div className={`${styles.searchBox} ${isOpen && searchTerm.trim() ? styles.activeBox : ''}`}>
        <FiSearch className={styles.searchIcon} aria-hidden="true" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label="Search food items"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearBtn}
            aria-label="Clear search query"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* Live Search Preview Dropdown */}
      {showPreview && isOpen && searchTerm.trim().length > 0 && (
        <div className={styles.previewDropdown}>
          {filteredFoods.length > 0 ? (
            <>
              <div className={styles.dropdownHeader}>
                <span>Dishes & Categories ({filteredFoods.length})</span>
              </div>
              <ul className={styles.resultsList}>
                {filteredFoods.slice(0, 6).map((item) => (
                  <li
                    key={item._id || item.id}
                    className={styles.resultItem}
                    onClick={() => handleItemSelect(item)}
                  >
                    <img
                      src={
                        item.image?.startsWith('http')
                          ? item.image
                          : `${url}/images/${item.image}`
                      }
                      alt={item.name}
                      className={styles.itemImage}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80';
                      }}
                    />
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemCategory}>{item.category}</span>
                    </div>
                    <div className={styles.itemPriceArea}>
                      <span className={styles.itemPrice}>Rs. {item.price}</span>
                      {addToCart && (
                        <button
                          type="button"
                          className={styles.addQuickBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item._id || item.id);
                          }}
                          title="Add to cart"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className={styles.noResults}>
              <p>No dishes found matching "<strong>{searchTerm}</strong>"</p>
              <span>Try searching for pizza, burger, pasta or drinks</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
