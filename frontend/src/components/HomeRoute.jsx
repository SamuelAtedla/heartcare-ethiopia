import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage2 from '../pages/LandingPage2';

const HomeRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (user) {
        if (user.role === 'doctor') {
            return <Navigate to="/doctor/dashboard" replace />;
        } else {
            return <Navigate to="/patient/dashboard" replace />;
        }
    }

    return <LandingPage2 />;
};

export default HomeRoute;
