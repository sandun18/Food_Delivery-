import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUploadCloud, FiPlusCircle, FiLoader } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';
import styles from './AdminAdd.module.css';

const CATEGORIES = [
  'Salad',
  'Rolls',
  'Deserts',
  'Sandwich',
  'Cake',
  'Pure Veg',
  'Pasta',
  'Noodles'
];

export default function AdminAdd() {
  const { url, token, fetchFoodList } = useAppContext();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Salad'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        toast.error('Only JPG, PNG, and WebP images are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.warning('Please select a dish image');
      return;
    }
    if (!data.name.trim()) {
      toast.warning('Please enter food item name');
      return;
    }
    if (!data.description.trim()) {
      toast.warning('Please provide a food description');
      return;
    }
    if (!data.price || Number(data.price) <= 0) {
      toast.warning('Please provide a valid price');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', data.name.trim());
      formData.append('description', data.description.trim());
      formData.append('price', Number(data.price));
      formData.append('category', data.category);
      formData.append('image', image);

      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token,
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.success) {
        toast.success(response.data.message || 'Food item added successfully!');
        // Reset form
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Salad'
        });
        setImage(null);
        if (preview) {
          URL.revokeObjectURL(preview);
          setPreview('');
        }
        // Refresh global food list
        if (fetchFoodList) fetchFoodList();
      } else {
        toast.error(response.data?.message || 'Failed to add food item');
      }
    } catch (error) {
      console.error('Error adding food:', error);
      const message = error.response?.data?.message || 'Server error while adding food item';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add New Food Dish</h1>
        <p className={styles.subtitle}>
          Upload dish media, assign nutritional categories, and configure customer pricing.
        </p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        {/* 1. Dish Image Upload */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Dish Image</label>
          <div className={styles.uploadWrapper}>
            <label htmlFor="dish-image" className={styles.uploadBox}>
              {preview ? (
                <img src={preview} alt="Dish Preview" className={styles.previewImg} />
              ) : (
                <div className={styles.placeholderContent}>
                  <FiUploadCloud className={styles.placeholderIcon} />
                  <span className={styles.placeholderText}>Click to upload image</span>
                </div>
              )}
            </label>
            <input
              type="file"
              id="dish-image"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleImageChange}
              hidden
            />
            <span className={styles.uploadHint}>Supported formats: JPG, PNG, WEBP (Max 5MB)</span>
          </div>
        </div>

        {/* 2. Product Name */}
        <div className={styles.formGroup}>
          <label htmlFor="food-name" className={styles.label}>Product Name</label>
          <input
            id="food-name"
            name="name"
            type="text"
            className={styles.input}
            placeholder="e.g. Classic Greek Salad"
            value={data.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 3. Product Description */}
        <div className={styles.formGroup}>
          <label htmlFor="food-desc" className={styles.label}>Product Description</label>
          <textarea
            id="food-desc"
            name="description"
            className={styles.textarea}
            placeholder="Describe the dish ingredients, taste notes, and portions..."
            value={data.description}
            onChange={handleInputChange}
            rows={4}
            required
          />
        </div>

        {/* 4. Category & Price Grid */}
        <div className={styles.gridTwo}>
          <div className={styles.formGroup}>
            <label htmlFor="food-category" className={styles.label}>Category</label>
            <select
              id="food-category"
              name="category"
              className={styles.select}
              value={data.category}
              onChange={handleInputChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="food-price" className={styles.label}>Product Price</label>
            <div className={styles.priceWrapper}>
              <span className={styles.currencyPrefix}>Rs.</span>
              <input
                id="food-price"
                name="price"
                type="number"
                min="1"
                step="any"
                className={`${styles.input} ${styles.priceInput}`}
                placeholder="e.g. 1200"
                value={data.price}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* 5. Submit Button */}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <>
              <FiLoader className={styles.spinner} />
              <span>Publishing Dish...</span>
            </>
          ) : (
            <>
              <FiPlusCircle />
              <span>Add Dish to Menu</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
