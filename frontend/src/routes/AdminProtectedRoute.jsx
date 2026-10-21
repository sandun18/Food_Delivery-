import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

/**
 * Route Guard for Admin Portal Routes
 * Ensures the visiting user is logged in and possesses the 'admin' role.
 */
export default function AdminProtectedRoute() {
  const { token, user } = useAppContext();
  const location = useLocation();

  // 1. Not Authenticated
  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 2. Token present, waiting for profile fetch from backend if user is still null
  if (!user) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '14px',
          color: '#64748b'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#ff5722',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        <span style={{ fontSize: '14px', fontWeight: 600 }}>
          Verifying administrative privileges...
        </span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 3. User is authenticated, but not an admin
  if (user.role !== 'admin') {
    toast.error('Access Denied: Administrator privileges required to access the admin portal');
    return <Navigate to="/" replace />;
  }

  // 4. Authorized administrator
  return <Outlet />;
}
