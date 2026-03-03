import React from 'react';
import styles from './InstallmentCalculator.module.css';

const InstallmentCalculator = ({ price }) => {
  const plans = [3, 6, 12];

  return (
    <div className={styles.calculator}>
      <h4 className={styles.title}>Pay in installments</h4>
      <div className={styles.plans}>
        {plans.map(months => {
          const monthly = (price / months).toFixed(2);
          return (
            <div key={months} className={styles.planRow}>
              <span>{months} months</span>
              <span className={styles.monthly}>${monthly}/month</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InstallmentCalculator;