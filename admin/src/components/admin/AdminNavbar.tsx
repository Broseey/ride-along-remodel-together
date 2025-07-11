import { Link } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@shared/contexts/AuthContext";

const AdminNavbar: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <nav className="w-full bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            to="/admin-dashboard"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-white"
          >
            <ShieldCheck className="h-6 w-6 text-white" />
            <span>Uniride Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {user && (
            <span className="text-xs md:text-sm text-neutral-300 font-semibold mr-2 md:mr-2 truncate max-w-[120px] md:max-w-none block">
              {user.email}
            </span>
          )}
          {user && (
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-700 hover:bg-neutral-900 transition-colors text-white font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
