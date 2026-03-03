import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import Button from '../components/Button';
import Modal from '../components/Modal';
import PaymentPlanSelector from '../components/PaymentPlanSelector';
import styles from './Checkout.module.css';

// const [gateway, setGateway] = useState('paypal'); // outside component
// const [processing, setProcessing] = useState(false); // outside component



const Checkout = () => {
  const [gateway, setGateway] = useState('paypal'); // outside component
  const [processing, setProcessing] = useState(false); // outside component

  const { cartItems, cartTotal, selectedPlan, setSelectedPlan, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [paymentType, setPaymentType] = useState('installment');
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    pickupLocation: 'store1',
  });
  const [apiError, setApiError] = useState('');

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowOrderSummary(true);
  };

  const handlePayment = async () => {
  setProcessing(true);
  try {
    // 1. Create order (if not already created)
    const orderPayload = {
      items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? `${formData.address}, ${formData.city} ${formData.zip}` : undefined,
      pickupLocation: deliveryMethod === 'pickup' ? formData.pickupLocation : undefined,
      paymentType,
      installmentMonths: paymentType === 'installment' ? selectedPlan.months : undefined,
    };
    const orderRes = await apiClient.post('/orders', orderPayload);
    const { order, payment } = orderRes.data.data;

    // 2. Initiate gateway payment
    if (gateway === 'paypal') {
      const initiateRes = await apiClient.post(`/payments/${payment.id}/paypal/initiate`);
      const { approvalUrl } = initiateRes.data.data;
      // Save payment info to session for later capture
      sessionStorage.setItem('pendingPayment', JSON.stringify({ paymentId: payment.id, gateway: 'paypal' }));
      // Redirect to PayPal
      window.location.href = approvalUrl;
    } else if (gateway === 'flutterwave') {
      const initiateRes = await apiClient.post(`/payments/${payment.id}/flutterwave/initiate`);
      const { paymentLink } = initiateRes.data.data;
      window.location.href = paymentLink;
    }
  } catch (err) {
    console.error(err);
    setApiError('Failed to initiate payment. Please try again.');
  } finally {
    setProcessing(false);
  }
};
  // const handlePayment = async () => {
  //   try {
  //     // Create order on backend
  //     const orderPayload = {
  //       items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
  //       deliveryMethod,
  //       address: deliveryMethod === 'delivery' ? `${formData.address}, ${formData.city} ${formData.zip}` : undefined,
  //       pickupLocation: deliveryMethod === 'pickup' ? formData.pickupLocation : undefined,
  //       paymentType,
  //       installmentMonths: paymentType === 'installment' ? selectedPlan.months : undefined,
  //     };
  //     const orderRes = await apiClient.post('/orders', orderPayload);
  //     const { order, payment } = orderRes.data.data;

  //     // Process payment
  //     await apiClient.post(`/payments/${payment.id}/process`, { paymentMethod });

  //     // Clear cart and redirect to profile
  //     clearCart();
  //     navigate('/profile');
  //   } catch (err) {
  //     console.error(err);
  //     setApiError('Failed to place order. Please try again.');
  //   }
  // };

  // Redirect if cart is empty (though PrivateRoute already protects this page)
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container">
      <h1 className={styles.pageTitle}>Checkout</h1>
      <div className={styles.checkoutLayout}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Contact Information</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>WhatsApp Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+1234567890"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Delivery Method</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                />
                <span>Home Delivery</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                />
                <span>Store Pickup</span>
              </label>
            </div>
          </div>

          {deliveryMethod === 'delivery' ? (
            <>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required={deliveryMethod === 'delivery'}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required={deliveryMethod === 'delivery'}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required={deliveryMethod === 'delivery'}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Pickup Location</label>
              <select
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required={deliveryMethod === 'pickup'}
                className={styles.formSelect}
              >
                <option value="store1">Downtown Store (123 Main St)</option>
                <option value="store2">Mall Store (456 Mall Ave)</option>
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Payment Type</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentType"
                  value="full"
                  checked={paymentType === 'full'}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                <span>Pay in Full</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentType"
                  value="installment"
                  checked={paymentType === 'installment'}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                <span>Pay in Installments</span>
              </label>
            </div>
          </div>

          {paymentType === 'installment' && (
            <div className={styles.formGroup}>
              <PaymentPlanSelector />
            </div>
          )}

          <Button type="submit" variant="primary" className={styles.submitButton}>
            Review Order
          </Button>
        </form>

        {/* Order Summary Sidebar */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} className={styles.summaryItem}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr className={styles.divider} />
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          {paymentType === 'installment' && (
            <div className={styles.installmentNote}>
              Pay in {selectedPlan.months} months: <strong>${(cartTotal / selectedPlan.months).toFixed(2)}/month</strong>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Modal */}
      <Modal isOpen={showOrderSummary} onClose={() => setShowOrderSummary(false)} title="Confirm Your Order">
        <div className={styles.modalContent}>
          <h3 className={styles.modalSubtitle}>Items</h3>
          <div className={styles.modalItems}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.modalItem}>
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className={styles.modalTotal}>
            <strong>Total:</strong> <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <div className={styles.modalPlan}>
            {paymentType === 'full' ? (
              <span>Paid in full</span>
            ) : (
              <>
                <span>Payment Plan: {selectedPlan.months} months</span>
                <span>${(cartTotal / selectedPlan.months).toFixed(2)}/month</span>
              </>
            )}
          </div>

          <div className={styles.modalDelivery}>
            <p><strong>Delivery Method:</strong> {deliveryMethod === 'delivery' ? 'Home Delivery' : 'Store Pickup'}</p>
            <p><strong>Address:</strong> {deliveryMethod === 'delivery' 
              ? `${formData.address}, ${formData.city} ${formData.zip}`
              : formData.pickupLocation === 'store1' ? 'Downtown Store (123 Main St)' : 'Mall Store (456 Mall Ave)'}</p>
          </div>

          <div className={styles.modalContact}>
            <p><strong>Contact:</strong> {formData.name} | {formData.email} | {formData.phone}</p>
          </div>

          <h3 className={styles.modalSubtitle}>Select Payment Method</h3>
          <div className={styles.paymentOptions}>
            <label className={styles.paymentOption}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>💳 Credit / Debit Card</span>
            </label>
            <label className={styles.paymentOption}>
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>🏦 Bank Transfer</span>
            </label>
            <label className={styles.paymentOption}>
              <input
                type="radio"
                name="paymentMethod"
                value="ussd"
                checked={paymentMethod === 'ussd'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>📱 USSD Code</span>
            </label>
            <h3 className={styles.modalSubtitle}>Select Payment Gateway</h3>
<div className={styles.paymentOptions}>
  <label className={styles.paymentOption}>
    <input
      type="radio"
      name="gateway"
      value="paypal"
      checked={gateway === 'paypal'}
      onChange={(e) => setGateway(e.target.value)}
    />
    <span>💳 PayPal</span>
  </label>
  <label className={styles.paymentOption}>
    <input
      type="radio"
      name="gateway"
      value="flutterwave"
      checked={gateway === 'flutterwave'}
      onChange={(e) => setGateway(e.target.value)}
    />
    <span>🌍 Flutterwave (Card/Bank/USSD)</span>
  </label>
</div>
          </div>

          {apiError && <div className={styles.apiError}>{apiError}</div>}

          <div className={styles.modalActions}>
            <Button variant="primary" onClick={handlePayment} className={styles.payButton}>
              Pay Now
            </Button>
            <Button variant="outline" onClick={() => setShowOrderSummary(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;