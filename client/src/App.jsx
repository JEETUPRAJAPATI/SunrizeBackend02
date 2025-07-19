import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

import Manufacturing from "@/pages/Manufacturing";
import Dispatches from "@/pages/Dispatches";
import Sales from "@/pages/Sales";
import Accounts from "@/pages/Accounts";
import ModernInventoryUI from "@/components/inventory/ModernInventoryUI";
import Customers from "@/pages/Customers";
import Suppliers from "@/pages/Suppliers";
import Purchases from "@/pages/Purchases";
import Settings from "@/pages/Settings";
import RolePermissionManagement from "@/pages/RolePermissionManagement";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import Profile from "@/pages/Profile";
import Companies from "@/pages/Companies";
import MyOrders from "@/pages/sales/MyIndent";
import MyCustomers from "@/pages/sales/MyCustomers";
import MyDeliveries from "@/pages/sales/MyDeliveries";
import MyInvoices from "@/pages/sales/MyInvoices";

import RefundDamage from "@/pages/sales/RefundDamage";
import SalesDashboard from "@/pages/SalesDashboard";
import NewProductionPage from "@/pages/NewProductionPage";
import ProductionHistoryPage from "@/pages/ProductionHistoryPage";
import RoleBasedDashboard from "@/components/layout/RoleBasedDashboard";
function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Check role restriction if specified - STRICT role checking
  // Exception: Super User can access all pages regardless of role restriction
  if (requiredRole && user.role !== requiredRole && user.role !== 'Super User') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access this page. Required role: {requiredRole}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <ProtectedRoute>
          <RoleBasedDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/manufacturing">
        <ProtectedRoute>
          <Manufacturing />
        </ProtectedRoute>
      </Route>
      <Route path="/production">
        <ProtectedRoute requiredRole="Production">
          <NewProductionPage />
        </ProtectedRoute>
      </Route>
      <Route path="/production/history">
        <ProtectedRoute requiredRole="Production">
          <ProductionHistoryPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dispatches">
        <ProtectedRoute>
          <Dispatches />
        </ProtectedRoute>
      </Route>
      {/* Sales Submodules - specific routes first */}
      <Route path="/sales/orders">
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      </Route>
      <Route path="/sales/my-customers">
        <ProtectedRoute>
          <MyCustomers />
        </ProtectedRoute>
      </Route>
      <Route path="/sales/my-deliveries">
        <ProtectedRoute>
          <MyDeliveries />
        </ProtectedRoute>
      </Route>
      <Route path="/sales/my-invoices">
        <ProtectedRoute>
          <MyInvoices />
        </ProtectedRoute>
      </Route>

      <Route path="/sales/refund-return">
        <ProtectedRoute>
          <RefundDamage />
        </ProtectedRoute>
      </Route>
      
      {/* Main Sales route */}
      <Route path="/sales">
        <ProtectedRoute>
          <Sales />
        </ProtectedRoute>
      </Route>
      
      {/* Sales Dashboard route */}
      <Route path="/sales-dashboard">
        <ProtectedRoute>
          <SalesDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/accounts">
        <ProtectedRoute>
          <Accounts />
        </ProtectedRoute>
      </Route>
      <Route path="/inventory">
        <ProtectedRoute>
          <ModernInventoryUI />
        </ProtectedRoute>
      </Route>
      <Route path="/customers">
        <ProtectedRoute>
          <Customers />
        </ProtectedRoute>
      </Route>
      <Route path="/suppliers">
        <ProtectedRoute>
          <Suppliers />
        </ProtectedRoute>
      </Route>
      <Route path="/purchases">
        <ProtectedRoute>
          <Purchases />
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path="/companies">
        <ProtectedRoute>
          <Companies />
        </ProtectedRoute>
      </Route>
      <Route path="/role-permission-management">
        <ProtectedRoute>
          <RolePermissionManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
