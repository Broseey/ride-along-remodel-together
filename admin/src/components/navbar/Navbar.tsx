import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav>
      {/* Main navigation links */}
      <ul className="...">
        {/* ...existing menu items... */}
        {user && (
          <li>
            <Link to="/available" className="...">
              Available Rides
            </Link>
          </li>
        )}
        {/* ...existing menu items... */}
      </ul>
    </nav>
  );
};

export default Navigation;
