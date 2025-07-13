"use client";

import React from "react";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./Sidebar"), {
  loading: () => <div className="w-64 bg-card/50 animate-pulse" />,
  ssr: false,
});

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Mobile header spacing */}
        <div className="lg:hidden h-16" />
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 lg:px-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
