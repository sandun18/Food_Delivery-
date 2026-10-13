import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from './Button';
import { FiTag, FiCheck, FiX } from 'react-icons/fi';
import styles from './OrderSummary.module.css';

/**
 * Order Summary Component
 * Automatically computes and displays:
 * - Subtotal
 * - Promo Code Discount
 * - Fixed Delivery Fee ($2)
 * - Grand Total
 * 
 * @param {Object} props
 * @param {number} [props.subtotal] - Optional override for subtotal amount
 * @param {number} [props.deliveryFee=2] - Fixed delivery fee ($2 default)
 * @param {string} [props.currency='$'] - Currency symbol ($ default)
 * @param {boolean} [props.showPromoInput=true] - Toggle display of promo code box
 * @param {string} [props.buttonText='PROCEED TO CHECKOUT'] - Label on checkout button
 * @param {Function} [props.onCheckout] - Custom checkout action handler
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function OrderSummary({
  subtotal: propSubtotal,
  deliveryFee: propDeliveryFee = 2,
  currency = '$',
  showPromoInput = true,
  buttonText = 'PROCEED TO CHECKOUT',
  onCheckout,
  className = ''
}) {
  const navigate = useNavigate();
  const { getTotalCartAmount } = useAppContext();

  // 1. Calculate Subtotal
  const rawSubtotal = propSubtotal !== undefined
    ? Number(propSubtotal)
    : Number(getTotalCartAmount ? getTotalCartAmount() : 0);

  // If cart is empty, delivery fee is 0, otherwise fixed $2
  const deliveryFee = rawSubtotal > 0 ? Number(propDeliveryFee) : 0;

  // 2. Promo Code State & Calculations
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Sample Promo Code Rates
  const PROMO_CODES = {
    FOODIE10: { type: 'percent', value: 10, label: '10% OFF' },
    SAVE20: { type: 'percent', value: 20, label: '20% OFF' },
    WELCOME5: { type: 'fixed', value: 5, label: '$5 OFF' },
    FREESHIP: { type: 'delivery', value: deliveryFee, label: 'Free Delivery' }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (rawSubtotal <= 0) {
      setPromoError('Add items to cart before applying promo');
      return;
    }

    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      setPromoCode('');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try SAVE20 or FOODIE10');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  // Calculate discount amount
  let discountAmount = 0;
  if (appliedPromo && rawSubtotal > 0) {
    if (appliedPromo.type === 'percent') {
      discountAmount = (rawSubtotal * appliedPromo.value) / 100;
    } else if (appliedPromo.type === 'fixed') {
      discountAmount = Math.min(rawSubtotal, appliedPromo.value);
    } else if (appliedPromo.type === 'delivery') {
      discountAmount = deliveryFee;
    }
  }

  // 3. Calculate Grand Total
  const grandTotal = rawSubtotal > 0
    ? Math.max(0, rawSubtotal - discountAmount + deliveryFee)
    : 0;

  const handleProceed = () => {
    if (onCheckout) {
      onCheckout({
        subtotal: rawSubtotal,
        discount: discountAmount,
        deliveryFee,
        grandTotal,
        appliedPromo
      });
    } else {
      navigate('/order');
    }
  };

  return (
    <div className={`${styles.orderSummaryCard} ${className}`}>
      <h3 className={styles.summaryTitle}>Cart Totals</h3>

      {/* Breakdown Rows */}
      <div className={styles.breakdown}>
        {/* Subtotal */}
        <div className={styles.summaryRow}>
          <span className={styles.rowLabel}>Subtotal</span>
          <span className={styles.rowValue}>
            {currency}{rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Promo Discount (if applied) */}
        {discountAmount > 0 && (
          <div className={`${styles.summaryRow} ${styles.discountRow}`}>
            <span className={styles.rowLabel}>
              Promo Discount ({appliedPromo?.label || appliedPromo?.code})
            </span>
            <span className={styles.discountValue}>
              -{currency}{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Fixed Delivery Charge */}
        <div className={styles.summaryRow}>
          <span className={styles.rowLabel}>Delivery Fee</span>
          <span className={styles.rowValue}>
            {rawSubtotal > 0 ? (
              `${currency}${deliveryFee.toFixed(2)}`
            ) : (
              <span className={styles.freeText}>Free</span>
            )}
          </span>
        </div>

        <hr className={styles.divider} />

        {/* Grand Total */}
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span className={styles.totalLabel}>Grand Total</span>
          <span className={styles.totalValue}>
            {currency}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Promo Code Box */}
      {showPromoInput && (
        <div className={styles.promoSection}>
          {appliedPromo ? (
            <div className={styles.appliedBadge}>
              <div className={styles.badgeLeft}>
                <FiCheck className={styles.checkIcon} />
                <span>Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.label})</span>
              </div>
              <button
                type="button"
                className={styles.removePromoBtn}
                onClick={handleRemovePromo}
                title="Remove discount"
                aria-label="Remove promo code"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className={styles.promoForm}>
              <div className={styles.promoInputWrapper}>
                <FiTag className={styles.promoIcon} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Enter promo code (e.g. SAVE20)"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    if (promoError) setPromoError('');
                  }}
                  className={styles.promoInput}
                  disabled={rawSubtotal === 0}
                />
                <button
                  type="submit"
                  className={styles.applyBtn}
                  disabled={rawSubtotal === 0 || !promoCode.trim()}
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <span className={styles.errorText}>{promoError}</span>
              )}
            </form>
          )}
        </div>
      )}

      {/* Proceed to Checkout CTA */}
      <div className={styles.actionArea}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={rawSubtotal === 0}
          onClick={handleProceed}
          className={styles.checkoutBtn}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
