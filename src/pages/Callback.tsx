import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      supabase.auth.exchangeCodeForSession(window.location.hash).then(() => {
        window.history.replaceState({}, document.title, location.pathname + location.search);
        // Redirect to dashboard or admin-dashboard as needed
        navigate("/dashboard", { replace: true });
      });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, location]);

  return null;
};

export default Callback;
