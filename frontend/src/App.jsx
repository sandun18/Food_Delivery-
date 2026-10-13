import React from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

/**
 * Main Application Root Layout
 * Conditionally isolates Admin Portal from Customer Storefront
 */
export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Global Toast Notifications Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {isAdminRoute ? (
        /* Dedicated Full-Screen Admin Portal */
        <div className="admin-app-wrapper">
          <AppRoutes />
        </div>
      ) : (
        /* Standard Customer Storefront Layout */
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}