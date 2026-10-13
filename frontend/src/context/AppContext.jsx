import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [user, setUser] = useState(null);

  // Synchronize token state with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // Global Context Values Bundle
  const contextValue = {
    url,
    food_list,
    setFoodList,
    cartItems,
    setCartItems,
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
