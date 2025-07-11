import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarWidthClass = isSidebarOpen ? "w-64" : "w-20";
  const mainMarginClass = isSidebarOpen ? "ml-64" : "ml-20";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md h-16">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </header>

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white text-gray-700 shadow-lg transition-all duration-300 ${sidebarWidthClass} z-40`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${mainMarginClass} mt-16`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
