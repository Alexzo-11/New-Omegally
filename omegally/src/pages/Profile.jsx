import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/orders');
        setOrders(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  // ... rest
};
export default Profile;