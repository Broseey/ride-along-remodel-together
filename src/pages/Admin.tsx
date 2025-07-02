import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client"; // adjust path if needed

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect all admin OAuth callbacks to /callback for unified handling
    if (window.location.hash.includes("access_token")) {
      navigate("/callback", { replace: true });
    } else {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default Admin;
