import React from 'react';
import styles from './Button.module.css';

/**
 * Reusable Button Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or nested content
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Button HTML type
 * @param {'primary'|'secondary'|'outline'|'danger'} [props.variant='primary'] - Visual styling variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.loading=false] - Display loading spinner and disable interaction
 * @param {boolean} [props.disabled=false] - Disable button interactions
 * @param {React.ReactNode} [props.icon] - Optional icon element
 * @param {'left'|'right'} [props.iconPosition='left'] - Position of the icon relative to children
 * @param {boolean} [props.fullWidth=false] - Stretch button across 100% of container width
 * @param {string} [props.className=''] - Additional custom CSS class names
 * @param {Function} [props.onClick] - Click event handler callback
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  ...rest
}) {
  const isDisabled = disabled || loading;

  const buttonClasses = [
    styles.button,
    styles[variant] || styles.primary,
    styles[size] || styles.md,
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    isDisabled ? styles.disabled : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && icon && iconPosition === 'left' && (
        <span className={styles.iconLeft}>{icon}</span>
      )}
      <span className={styles.label}>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.iconRight}>{icon}</span>
      )}
    </button>
  );
}
