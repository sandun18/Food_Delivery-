import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import styles from './FoodCard.module.css';

/**
 * Dynamic Food Card Component
 * Displays food item details with image, rating, title, description, price,
 * and a floating interactive +/- cart quantity controller
 * 
 * Supports both:
 * <FoodCard id={item._id} name={item.name} price={item.price} description={item.description} image={item.image} />
 * and
 * <FoodCard food={item} />
 */
export default function FoodCard(props) {
  const { cartItems, addToCart, removeFromCart, url } = useAppContext();

  // Extract props supporting both explicit fields or nested food object
  const id = props.id || props.food?._id || props.food?.id;
  const name = props.name || props.food?.name || 'Delicious Dish';
  const price = props.price !== undefined ? props.price : props.food?.price || 0;
  const description = props.description || props.food?.description || '';
  const rawImage = props.image || props.food?.image;
  const category = props.category || props.food?.category;

  // Resolve image URL
  const getImageSrc = () => {
    if (!rawImage) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
    }
    if (typeof rawImage === 'string') {
      if (rawImage.startsWith('http://') || rawImage.startsWith('https://') || rawImage.startsWith('data:')) {
        return rawImage;
      }
      return `${url}/images/${rawImage}`;
    }
    return rawImage;
  };

  const itemCount = id && cartItems ? cartItems[id] || 0 : 0;

  return (
    <article className={styles.foodCard}>
      {/* Food Image Container with Floating Cart Controller */}
      <div className={styles.imageContainer}>
        <img
          src={getImageSrc()}
          alt={name}
          className={styles.foodImage}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
          }}
        />

        {category && (
          <span className={styles.categoryBadge}>{category}</span>
        )}

        {/* Floating Cart Counter Controller */}
        <div className={styles.cartControlWrapper}>
          {!itemCount ? (
            <img
              src={assets.add_icon_white}
              alt="Add to cart"
              className={styles.addBtn}
              onClick={() => addToCart(id)}
              title="Add to cart"
            />
          ) : (
            <div className={styles.counterContainer}>
              <img
                src={assets.remove_icon_red}
                alt="Remove from cart"
                className={styles.counterBtn}
                onClick={() => removeFromCart(id)}
                title="Decrease quantity"
              />
              <span className={styles.counterValue}>{itemCount}</span>
              <img
                src={assets.add_icon_green}
                alt="Add more to cart"
                className={styles.counterBtn}
                onClick={() => addToCart(id)}
                title="Increase quantity"
              />
            </div>
          )}
        </div>
      </div>

      {/* Food Details Body */}
      <div className={styles.foodInfo}>
        <div className={styles.nameRatingRow}>
          <h3 className={styles.foodName}>{name}</h3>
          <img
            src={assets.rating_starts}
            alt="Customer rating"
            className={styles.ratingStars}
          />
        </div>

        <p className={styles.foodDescription}>{description}</p>

        <div className={styles.priceRow}>
          <span className={styles.foodPrice}>
            Rs. {Number(price).toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}
