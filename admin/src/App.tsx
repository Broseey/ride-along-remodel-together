import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@shared/contexts/AuthContext";
import AdminSignIn from "./pages/AdminSignIn";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";

import AdminQuickRoutesPage from "./pages/AdminQuickRoutes";
import "./App.css";

import AdminRoute from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Admin routes */}
              <Route path="/admin-signin" element={<AdminSignIn />} />
              <Route path="/" element={<Admin />} />
              {/* Protected admin routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin-dashboard/quick-routes"
                element={
                  <AdminRoute>
                    <AdminQuickRoutesPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
