import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import PaymentPlanSelector from '../components/PaymentPlanSelector';
import styles from './Cart.module.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, selectedPlan } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className={styles.emptyCart}>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <Link to="/products">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className={styles.pageTitle}>Your Cart</h1>
      <div className={styles.cartLayout}>
        <div className={styles.cartItems}>
          {cartItems.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>${item.price}</p>
              </div>
              <div className={styles.itemActions}>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className={styles.quantityInput}
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          {selectedPlan.months && (
            <div className={`${styles.summaryRow} ${styles.installmentRow}`}>
              <span>{selectedPlan.months}-month plan</span>
              <span>${(cartTotal / selectedPlan.months).toFixed(2)}/month</span>
            </div>
          )}
          <hr className={styles.divider} />
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Button
            variant="primary"
            className={styles.checkoutButton}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
          <Link to="/products">
            <Button variant="outline" className={styles.continueButton}>Continue Shopping</Button>
          </Link>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className={styles.planSelectorSection}>
          <PaymentPlanSelector />
        </div>
      )}
    </div>
  );
};

export default Cart;