import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import Button from '../components/Button';
import { food_list as defaultFoodList } from '../data/food';
import { FiArrowLeft, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import styles from './Cart.module.css';

/**
 * Cart Page Assembly
 * Composes Cart Items Table, Empty Cart Illustration, Order Summary with Promo Code & Checkout
 */
export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, food_list, clearCart, getTotalCartCount } = useAppContext();

  // Combine live food list with fallback
  const allFoods = food_list && food_list.length > 0 ? food_list : defaultFoodList;

  // Filter items currently in cart with quantity > 0
  const activeCartItems = allFoods.filter((item) => {
    const id = item._id || item.id;
    return cartItems && (cartItems[id] > 0 || cartItems[String(id)] > 0);
  });

  const cartCount = getTotalCartCount ? getTotalCartCount() : activeCartItems.length;

  return (
    <div className={styles.cartPage}>
      {/* Page Title & Breadcrumb Header */}
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Your Shopping Cart</h1>
          <p className={styles.subtitle}>
            Review your selected dishes, apply discounts, and complete your order.
          </p>
        </div>
        {activeCartItems.length > 0 && (
          <div className={styles.badgeWrapper}>
            <span className={styles.itemCountBadge}>
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        )}
      </header>

      {activeCartItems.length === 0 ? (
        /* Empty Cart State */
        <section className={styles.emptyCartCard} aria-label="Empty cart notification">
          <div className={styles.emptyIconCircle}>
            <FiShoppingBag className={styles.emptyIcon} />
          </div>
          <h2 className={styles.emptyTitle}>Your cart is currently empty</h2>
          <p className={styles.emptyDesc}>
            Looks like you haven't added any dishes to your cart yet. Explore our menu and indulge in your favorite meals!
          </p>
          <div className={styles.emptyActions}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/menu')}
              className={styles.browseBtn}
            >
              Explore Our Menu
            </Button>
          </div>
        </section>
      ) : (
        /* Active Cart Layout: Items Table (Left) + Order Summary (Right) */
        <div className={styles.cartLayout}>
          {/* Left Column: Cart Items Table */}
          <div className={styles.cartItemsSection}>
            <div className={styles.tableHeader}>
              <span className={styles.thItem}>Dish</span>
              <span className={styles.thPrice}>Price</span>
              <span className={styles.thQuantity}>Quantity</span>
              <span className={styles.thTotal}>Total</span>
              <span className={styles.thRemove}>Action</span>
            </div>

            <div className={styles.itemsList}>
              {activeCartItems.map((item) => {
                const id = item._id || item.id;
                return (
                  <CartItem
                    key={id}
                    item={item}
                    quantity={cartItems[id] || cartItems[String(id)]}
                  />
                );
              })}
            </div>

            {/* Bottom Actions Row */}
            <div className={styles.cartFooterControls}>
              <Link to="/menu" className={styles.continueLink}>
                <FiArrowLeft />
                <span>Continue Shopping</span>
              </Link>

              {clearCart && (
                <button
                  type="button"
                  className={styles.clearCartBtn}
                  onClick={clearCart}
                  title="Remove all items from cart"
                >
                  <FiTrash2 />
                  <span>Clear Entire Cart</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (Subtotal, Promo, $2 Delivery, Grand Total & Checkout) */}
          <aside className={styles.orderSummarySection} aria-label="Order summary sidebar">
            <OrderSummary
              onCheckout={() => navigate('/order')}
              currency="$"
              buttonText="PROCEED TO CHECKOUT"
            />
          </aside>
        </div>
      )}
    </div>
  );
}
