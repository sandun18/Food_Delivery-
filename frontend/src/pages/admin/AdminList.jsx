import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiTrash2, FiSearch, FiInbox, FiLoader, FiRefreshCw } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';
import styles from './AdminList.module.css';

export default function AdminList() {
  const { url, token, fetchFoodList } = useAppContext();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch all food dishes from backend
  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data?.success) {
        setList(response.data.data || []);
      } else {
        toast.error(response.data?.message || 'Failed to load food dishes');
      }
    } catch (error) {
      console.error('Error fetching food list:', error);
      toast.error('Unable to fetch food items from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Remove dish from database and static uploads
  const handleRemove = async (foodId, foodName) => {
    if (!window.confirm(`Are you sure you want to remove "${foodName}" from the menu?`)) {
      return;
    }

    try {
      setDeletingId(foodId);
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId },
        {
          headers: {
            token,
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {
        toast.success(response.data?.message || 'Food item removed successfully');
        // Update local list instantly
        setList((prev) => prev.filter((item) => (item._id || item.id) !== foodId));
        // Sync global customer app context
        if (fetchFoodList) fetchFoodList();
      } else {
        toast.error(response.data?.message || 'Failed to remove dish');
      }
    } catch (error) {
      console.error('Error removing food:', error);
      const message = error.response?.data?.message || 'Server error while removing dish';
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered items based on search and category
  const filteredList = list.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(list.map((item) => item.category).filter(Boolean))];

  return (
    <div className={styles.container}>
      {/* Header and Filter Controls */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Food Catalog List</h1>
          <p className={styles.subtitle}>
            Browse, search, and manage all published food items in your live menu ({list.length} total).
          </p>
        </div>

        <div className={styles.filterControls}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by dish name..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className={styles.categorySelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingBox}>
            <FiLoader className={styles.spinner} />
            <span>Loading food catalog...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className={styles.emptyContainer}>
            <FiInbox className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No Food Items Found</h3>
            <p className={styles.emptySubtitle}>
              {searchTerm || selectedCategory !== 'All'
                ? 'Try adjusting your search query or category filter.'
                : 'No food dishes have been added yet. Use "Add Items" to publish your first dish.'}
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Dish Name & Details</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Price</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => {
                const itemId = item._id || item.id;
                const imageUrl = item.image?.startsWith('http')
                  ? item.image
                  : `${url}/images/${item.image}`;

                return (
                  <tr key={itemId} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.dishCell}>
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className={styles.dishImage}
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/100x100?text=Food';
                          }}
                        />
                        <div className={styles.dishInfo}>
                          <span className={styles.dishName}>{item.name}</span>
                          <span className={styles.dishDesc} title={item.description}>
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className={styles.td}>
                      <span className={styles.categoryBadge}>{item.category}</span>
                    </td>

                    <td className={styles.td}>
                      <span className={styles.priceText}>Rs. {Number(item.price).toLocaleString()}</span>
                    </td>

                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleRemove(itemId, item.name)}
                        disabled={deletingId === itemId}
                        title="Delete dish"
                        aria-label={`Delete ${item.name}`}
                      >
                        {deletingId === itemId ? (
                          <FiLoader className={styles.spinner} style={{ fontSize: '15px' }} />
                        ) : (
                          <FiTrash2 />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
