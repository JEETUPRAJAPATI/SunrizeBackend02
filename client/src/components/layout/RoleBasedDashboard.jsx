import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import Dashboard from "@/pages/Dashboard";
import SalesDashboard from "@/pages/SalesDashboard";

export default function RoleBasedDashboard() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // If user has specific role, redirect to their dashboard
    if (user && location === '/') {
      switch (user.role) {
        case 'Sales':
          setLocation('/sales-dashboard');
          return;
        case 'Production':
          setLocation('/production');
          return;
        case 'Dispatch':
          setLocation('/dispatches');
          return;
        case 'Accounts':
          setLocation('/accounts');
          return;
        default:
          // Super User, Unit Head, and others stay on main dashboard
          break;
      }
    }
  }, [user, location, setLocation]);

  // For direct dashboard access, show appropriate dashboard based on role
  if (user?.role === 'Sales') {
    return <SalesDashboard />;
  }

  // Default to main dashboard for Super User, Unit Head, etc.
  return <Dashboard />;
}