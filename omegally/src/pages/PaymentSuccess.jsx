import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const gateway = searchParams.get('gateway');
    const paypalOrderId = searchParams.get('token'); // PayPal returns token
    const pending = JSON.parse(sessionStorage.getItem('pendingPayment') || '{}');

    if (gateway === 'paypal' && paypalOrderId && pending.paymentId) {
      apiClient.post('/payments/paypal/capture', { paypalOrderId })
        .then(() => {
          sessionStorage.removeItem('pendingPayment');
          navigate('/profile?payment=success');
        })
        .catch(err => {
          console.error(err);
          navigate('/profile?payment=failed');
        });
    } else if (gateway === 'flutterwave') {
      // Flutterwave redirects back; webhook will handle async update
      sessionStorage.removeItem('pendingPayment');
      navigate('/profile?payment=processing');
    }
  }, [searchParams, navigate]);

  return <div>Processing payment...</div>;
};

export default PaymentSuccess;