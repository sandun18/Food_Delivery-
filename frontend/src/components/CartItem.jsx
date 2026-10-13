import React from 'react';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import styles from './CartItem.module.css';

/**
 * Cart Item Component
 * Displays food image, name, unit price, - / + quantity controllers,
 * calculated total price, and delete/remove button
 * 
 * @param {Object} props
 * @param {Object} props.item - Food item object (id, name, price, image, category)
 * @param {number} [props.quantity] - Current quantity in cart
 * @param {Function} [props.onIncrease] - Optional custom handler for quantity increment
 * @param {Function} [props.onDecrease] - Optional custom handler for quantity decrement
 * @param {Function} [props.onRemove] - Optional custom handler for complete item removal
 * @param {string} [props.className=''] - Additional custom CSS class names
 */
export default function CartItem({
  item,
  quantity: propQuantity,
  onIncrease,
  onDecrease,
  onRemove,
  className = ''
}) {
  const { cartItems, addToCart, removeFromCart, setCartItems, url } = useAppContext();

  if (!item) return null;

  const id = item._id || item.id;
  const quantity = propQuantity !== undefined ? propQuantity : (cartItems?.[id] || 0);

  if (quantity <= 0) return null;

  const price = Number(item.price || 0);
  const total = price * quantity;

  // Resolve food image source
  const getImageSrc = () => {
    if (!item.image) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&q=80';
    }
    if (typeof item.image === 'string') {
      if (item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.startsWith('data:')) {
        return item.image;
      }
      return `${url}/images/${item.image}`;
    }
    return item.image;
  };

  const handleIncrease = () => {
    if (onIncrease) {
      onIncrease(id);
    } else {
      addToCart(id);
    }
  };

  const handleDecrease = () => {
    if (onDecrease) {
      onDecrease(id);
    } else {
      removeFromCart(id);
    }
  };

  const handleDelete = () => {
    if (onRemove) {
      onRemove(id);
    } else {
      setCartItems((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <div className={`${styles.cartItemRow} ${className}`}>
      {/* 1. Item Image & Details */}
      <div className={styles.itemDetails}>
        <img
          src={getImageSrc()}
          alt={item.name}
          className={styles.itemImage}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&q=80';
          }}
        />
        <div className={styles.itemInfo}>
          <h4 className={styles.itemName}>{item.name}</h4>
          {item.category && (
            <span className={styles.itemCategory}>{item.category}</span>
          )}
        </div>
      </div>

      {/* 2. Unit Price */}
      <div className={styles.colUnitPrice}>
        <span className={styles.mobileLabel}>Price:</span>
        <span className={styles.unitPrice}>Rs. {price.toLocaleString()}</span>
      </div>

      {/* 3. - / + Quantity Controllers */}
      <div className={styles.colQuantity}>
        <span className={styles.mobileLabel}>Qty:</span>
        <div className={styles.quantityController}>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={handleDecrease}
            aria-label="Decrease quantity"
            title="Decrease quantity"
          >
            <FiMinus />
          </button>
          <span className={styles.qtyValue}>{quantity}</span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={handleIncrease}
            aria-label="Increase quantity"
            title="Increase quantity"
          >
            <FiPlus />
          </button>
        </div>
      </div>

      {/* 4. Calculated Item Total */}
      <div className={styles.colTotal}>
        <span className={styles.mobileLabel}>Total:</span>
        <span className={styles.totalPrice}>Rs. {total.toLocaleString()}</span>
      </div>

      {/* 5. Delete / Remove Button */}
      <div className={styles.colRemove}>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDelete}
          aria-label={`Remove ${item.name} from cart`}
          title="Remove from cart"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}
