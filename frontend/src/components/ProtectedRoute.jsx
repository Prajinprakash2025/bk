import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requireStaff = false }) => {
    const { isAuthenticated, user, loading } = useSelector(state => state.auth);

    // Show loading while checking authentication
    if (loading || (isAuthenticated && !user)) {
        return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireStaff && !user?.is_staff) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
