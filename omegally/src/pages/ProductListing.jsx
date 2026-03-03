import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../api/client';
import ProductCard from '../components/ProductCard';
import styles from './ProductListing.module.css';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category') || 'all';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categoryFromUrl);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'all') params.category = category;
        if (search) params.search = search;
        if (priceRange.min) params.minPrice = priceRange.min;
        if (priceRange.max < 1000) params.maxPrice = priceRange.max;
        const response = await apiClient.get('/products', { params });
        setProducts(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, priceRange]);

  // ... rest of component (filtering, rendering)
};

export default ProductListing;