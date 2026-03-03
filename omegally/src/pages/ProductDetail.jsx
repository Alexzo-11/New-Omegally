import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/client';
// ... other imports

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/products/${id}`)
      .then(res => setProduct(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // ... render
};
export default ProductDetail;