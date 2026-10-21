import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import PlaceOrder from '../pages/PlaceOrder';
import MyOrders from '../pages/MyOrders';
import Verify from '../pages/Verify';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

import AdminProtectedRoute from './AdminProtectedRoute';

// Admin Pages
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminAdd from '../pages/admin/AdminAdd';
import AdminList from '../pages/admin/AdminList';
import AdminOrders from '../pages/admin/AdminOrders';

/**
 * Main Application Routing Architecture
 * Connects all pages and nested views using React Router DOM v7
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />

      {/* Checkout & Order Placement */}
      <Route path="/order" element={<PlaceOrder />} />
      <Route path="/place-order" element={<PlaceOrder />} />

      {/* Order History & Tracking */}
      <Route path="/myorders" element={<MyOrders />} />
      <Route path="/orders" element={<MyOrders />} />

      {/* Payment Redirection & Verification */}
      <Route path="/verify" element={<Verify />} />

      {/* Authentication */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register" element={<SignUp />} />

      {/* User Account */}
      <Route path="/profile" element={<Profile />} />

      {/* Admin Portal Protected Nested Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add" element={<AdminAdd />} />
          <Route path="list" element={<AdminList />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}