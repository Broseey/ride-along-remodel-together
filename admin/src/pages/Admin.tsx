import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

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
