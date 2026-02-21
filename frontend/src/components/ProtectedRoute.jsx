import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roles }) => {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(userInfo.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
