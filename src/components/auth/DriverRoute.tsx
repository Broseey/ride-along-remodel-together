
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DriverRouteProps {
  children: React.ReactNode;
}

const DriverRoute: React.FC<DriverRouteProps> = ({ children }) => {
  const { user, driverProfile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/driver-signin" state={{ from: location }} replace />;
  }

  if (!driverProfile) {
    toast.error("Driver profile not found. Please complete your driver registration.");
    return <Navigate to="/driver-signup" replace />;
  }

  if (driverProfile.verification_status !== 'verified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Account Under Review</h2>
          <p className="text-gray-600 mb-6">
            Your driver account is currently being reviewed by our admin team. 
            This process typically takes up to 1 week. You'll receive an email 
            notification once your account is approved.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-yellow-800">
              Status: <span className="font-semibold capitalize">{driverProfile.verification_status}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DriverRoute;
