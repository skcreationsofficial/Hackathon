import React, { useState } from "react";
import Header from "../Header/Header";
import Sidebar, { type SidebarLink } from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export interface LayoutProps {
  sidebarLinks: SidebarLink[];
}

const Layout: React.FC<LayoutProps> = ({ sidebarLinks }) => {

  // Sidebar open state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-w-screen min-h-screen">
      
      {/* Sidebar */}
      <Sidebar
        links={sidebarLinks}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={'Laboratory Management'}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header userName="Suresh" setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{<Outlet />}</main>
      </div>
    </div>
  );
};

export default Layout;