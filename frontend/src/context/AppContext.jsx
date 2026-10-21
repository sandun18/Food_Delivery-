import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Global Application Context
 */
export const AppContext = createContext(null);

/**
 * Custom Hook for consuming AppContext cleanly
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

/**
 * AppContextProvider Component
 * Manages global state variables: food_list, cartItems, token, user, and backend url
 */
export const AppContextProvider = ({ children }) => {
  // 1. Backend API Base URL
  const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // 2. Global Food List
  const [food_list, setFoodList] = useState([]);

  // 3. Cart Items Object: { [itemId]: quantity }
  const [cartItems, setCartItems] = useState({});

  // 4. JWT Authentication Token (persisted in localStorage)
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  // 5. Authenticated User Profile Object
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  /**
   * Fetch live food items from backend API
   */
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data?.success) {
        setFoodList(response.data.data || []);
      } else {
        console.error('Failed to fetch food list:', response.data?.message);
      }
    } catch (error) {
      console.error('Error fetching live food list:', error);
    }
  };

  /**
   * Add an item to the cart (updates local state & syncs with backend if authenticated)
   * @param {string|number} itemId
   */
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token, Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error adding item to backend cart:', error);
      }
    }
  };

  /**
   * Remove or decrement an item in the cart (updates local state & syncs with backend if authenticated)
   * @param {string|number} itemId
   */
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      if (prev[itemId] <= 1) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return {
        ...prev,
        [itemId]: prev[itemId] - 1
      };
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token, Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error removing item from backend cart:', error);
      }
    }
  };

  /**
   * Clear the cart locally and on backend if logged in
   */
  const clearCart = async () => {
    setCartItems({});
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/clear`,
          {},
          { headers: { token, Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error clearing cart on backend:', error);
      }
    }
  };

  /**
   * Fetch authenticated user's cart from backend
   * @param {string} authToken
   */
  const loadCartData = async (authToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: authToken, Authorization: `Bearer ${authToken}` } }
      );
      if (response.data?.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (error) {
      console.error('Error fetching cart data from backend:', error);
    }
  };

  /**
   * Calculate total monetary amount of items in cart
   * @returns {number}
   */
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find(
          (product) => String(product._id) === String(item) || String(product.id) === String(item)
        );
        if (itemInfo) {
          totalAmount += Number(itemInfo.price || 0) * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  /**
   * Calculate total quantity of items in cart
   * @returns {number}
   */
  const getTotalCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalCount += cartItems[item];
      }
    }
    return totalCount;
  };

  /**
   * Fetch authenticated user profile
   * @param {string} authToken
   */
  const loadUserProfile = async (authToken) => {
    try {
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: { token: authToken, Authorization: `Bearer ${authToken}` }
      });
      if (response.data?.success && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Synchronize token state with localStorage and load backend cart & profile
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      loadCartData(token);
      loadUserProfile(token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCartItems({});
    }
  }, [token]);

  // Initial data loading on mount
  useEffect(() => {
    fetchFoodList();
  }, []);

  // Global Context Values Bundle
  const contextValue = {
    url,
    food_list,
    setFoodList,
    fetchFoodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    loadCartData,
    getTotalCartAmount,
    getTotalCartCount,
    token,
    setToken,
    user,
    setUser
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
