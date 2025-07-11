import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  LayoutDashboard, 
  TrendingUp, 
  Receipt, 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
      
      <div className={`bg-white text-gray-700 shadow-lg w-72 fixed top-0 left-0 h-full transition-all ease-in-out duration-300 z-50
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Sidebar Toggle Button for Mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-3 text-white bg-blue-600 fixed top-4 left-4 z-50 rounded-full shadow-md hover:bg-blue-700 transition-all"
        >
          ☰
        </button>

        {/* Sidebar Content */}
        <div className="h-full flex flex-col">

          {/* Removed Logo/Header Section */}

          {user ? (
            <>
              {/* User Profile */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name || "User"}</p>
                    <p className="text-sm text-gray-500">{user.email || "user@example.com"}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <Link 
                  to="/dashboard" 
                  className={`flex items-center py-3 px-4 rounded-lg transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <LayoutDashboard size={20} className="mr-3" />
                  Dashboard
                </Link>
                
                <Link 
                  to="/dashboard/income" 
                  className={`flex items-center py-3 px-4 rounded-lg transition-all ${
                    isActive('/dashboard/income') 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <TrendingUp size={20} className="mr-3" />
                  Income
                </Link>
                
                <Link 
                  to="/dashboard/expenses" 
                  className={`flex items-center py-3 px-4 rounded-lg transition-all ${
                    isActive('/dashboard/expenses') 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <Receipt size={20} className="mr-3" />
                  Expenses
                </Link>
              </div>
              
              {/* Bottom Actions */}
              <div className="border-t border-gray-100 p-4 space-y-2">
                <button
                  onClick={logout}
                  className="flex items-center w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400">Please log in</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
