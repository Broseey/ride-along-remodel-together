
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to admin dashboard
    navigate('/admin-dashboard', { replace: true });
  }, [navigate]);

  return null;
};

export default Admin;
