import React from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

/**
 * Main Application Root Layout
 * Wraps Navbar, Dynamic Routes, Global Toast Notifications, and Footer
 */
export default function App() {
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

      {/* Responsive Centered App Shell */}
      <div className="app">
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </>
  );
}