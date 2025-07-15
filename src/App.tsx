import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { ForgotPassword } from "@/pages/ForgotPassword";
import HODDashboard from "./pages/HODDashboard";
import ChefDashboard from "./pages/ChefDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import StorekeeperDashboard from "./pages/StorekeeperDashboard";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";

const DashboardRedirect = () => {
  const { userProfile } = useAuth();
  
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }
  
  switch (userProfile.role) {
    case 'HOD':
      return <Navigate to="/dashboard/hod" replace />;
    case 'Chef':
      return <Navigate to="/dashboard/chef" replace />;
    case 'Manager':
      return <Navigate to="/dashboard/manager" replace />;
    case 'Storekeeper':
      return <Navigate to="/dashboard/store" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Role-specific dashboards */}
            <Route 
              path="/dashboard/hod" 
              element={
                <ProtectedRoute requiredRole="HOD">
                  <HODDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/chef" 
              element={
                <ProtectedRoute requiredRole="Chef">
                  <ChefDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/manager" 
              element={
                <ProtectedRoute requiredRole="Manager">
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/store" 
              element={
                <ProtectedRoute requiredRole="Storekeeper">
                  <StorekeeperDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;