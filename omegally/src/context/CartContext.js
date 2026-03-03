import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../api/client';


const CartContext = createContext();

const initialState = {
  cartItems: [],
  selectedPlan: { months: 3, monthly: 0 },
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cartItems: action.payload };
    case 'ADD_TO_CART':
      const existing = state.cartItems.find(item => item.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cartItems: [...state.cartItems, action.payload] };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.productId !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cartItems: [] };
    case 'SET_PLAN':
      return { ...state, selectedPlan: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from backend when user logs in
  useEffect(() => {
    if (user) {
      apiClient.get('/cart')
        .then(response => {
          // Transform backend cart format to frontend format (productId -> id)
          const items = response.data.data.map(item => ({
            id: item.productId._id,
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.images?.[0],
            quantity: item.quantity,
          }));
          dispatch({ type: 'SET_CART', payload: items });
        })
        .catch(err => console.error(err));
    } else {
      dispatch({ type: 'SET_CART', payload: [] });
    }
  }, [user]);

  // Save cart to backend whenever it changes (debounced)
  useEffect(() => {
    if (user && state.cartItems.length > 0) {
      const timeout = setTimeout(() => {
        // For simplicity, we replace the entire cart via multiple calls or a sync endpoint.
        // A better approach: use a dedicated sync endpoint, but here we'll just add/update as needed.
        // Since we have individual add/update/remove, we don't need a full sync.
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [state.cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      // Redirect to login handled elsewhere, but we can just call login redirect
      return;
    }
    try {
      await apiClient.post('/cart/items', { productId: product.id, quantity });
      dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, ...product, quantity } });
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await apiClient.delete(`/cart/items/${productId}`);
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await apiClient.put(`/cart/items/${productId}`, { quantity });
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.delete('/cart');
      dispatch({ type: 'CLEAR_CART' });
    } catch (err) {
      console.error(err);
    }
  };

  const setSelectedPlan = (plan) => dispatch({ type: 'SET_PLAN', payload: plan });

  const cartTotal = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cartItems: state.cartItems,
    selectedPlan: state.selectedPlan,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSelectedPlan,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }