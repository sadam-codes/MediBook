import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userString || !token) {
        // Redirect them to the /login page, but save the current location they were trying to go to
        // Redirect to Home and signal that we should show login modal
        sessionStorage.setItem('showLogin', 'true');
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
