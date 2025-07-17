import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NavBar from './NavBar';
import { useAuth } from '@/hooks/useAuth';

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="md:ml-72">
        <NavBar onSidebarToggle={() => setSidebarOpen(true)} />
        
        {/* Main Content - Edge to Edge */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
