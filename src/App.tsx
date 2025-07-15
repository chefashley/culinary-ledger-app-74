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
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ChefDashboard from "./pages/ChefDashboard";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";

const DashboardRedirect = () => {
  const { userProfile } = useAuth();
  
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }
  
  switch (userProfile.role) {
    case 'Admin':
      return <Navigate to="/admin-dashboard" replace />;
    case 'Manager':
      return <Navigate to="/manager-dashboard" replace />;
    case 'Chef':
      return <Navigate to="/chef-dashboard" replace />;
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
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager-dashboard" 
              element={
                <ProtectedRoute requiredRole="Manager">
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chef-dashboard" 
              element={
                <ProtectedRoute requiredRole="Chef">
                  <ChefDashboard />
                </ProtectedRoute>
              } 
            />
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