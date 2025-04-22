import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Define Tailwind CSS classes for sidebar width and corresponding main content margin
  const sidebarWidthClass = isSidebarOpen ? "w-64" : "w-20";
  const mainMarginClass = isSidebarOpen ? "ml-64" : "ml-20";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </header>

      {/* Layout Container */}
      <div className="flex flex-1">
        {/* Fixed Sidebar with increased top padding */}
        <aside
          className={`fixed top-0 left-0 h-screen bg-gray-800 text-white transition-all duration-300 ${sidebarWidthClass} pt-24`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </aside>

        {/* Main Content Area with margin to accommodate the fixed sidebar */}
        <main className={`flex-1 p-6 transition-all duration-300 ${mainMarginClass}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
