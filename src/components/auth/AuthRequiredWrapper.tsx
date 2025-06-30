
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthRequiredWrapperProps {
  children: React.ReactNode;
  action?: string;
}

const AuthRequiredWrapper: React.FC<AuthRequiredWrapperProps> = ({ 
  children, 
  action = "access this feature" 
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleAuthRequired = () => {
    toast.error(`Please sign in to ${action}`);
    navigate('/signin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    handleAuthRequired();
    return null;
  }

  return <>{children}</>;
};

export default AuthRequiredWrapper;
