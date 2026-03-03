import React from 'react';
import { useCart } from '../context/CartContext';
import styles from './PaymentPlanSelector.module.css';

const PaymentPlanSelector = () => {
  const { selectedPlan, setSelectedPlan, cartTotal } = useCart();
  const plans = [3, 6, 12];

  const handlePlanChange = (months) => {
    const monthly = cartTotal / months;
    setSelectedPlan({ months, monthly });
  };

  return (
    <div className={styles.selector}>
      <h3 className={styles.heading}>Choose your installment plan</h3>
      <div className={styles.planList}>
        {plans.map(months => {
          const monthly = (cartTotal / months).toFixed(2);
          return (
            <label key={months} className={styles.planOption}>
              <div className={styles.planInfo}>
                <input
                  type="radio"
                  name="plan"
                  value={months}
                  checked={selectedPlan.months === months}
                  onChange={() => handlePlanChange(months)}
                  className={styles.radio}
                />
                <span>{months} months</span>
              </div>
              <span className={styles.monthlyAmount}>${monthly}/month</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentPlanSelector;