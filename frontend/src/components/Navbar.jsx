import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Settings, Bell, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
          <Link
            to="/dashboard"
            className="text-blue-600 font-bold text-xl tracking-wide hover:text-blue-800 transition-all"
          >
            Expense Manager
          </Link>
        </div>

        {/* Right side icons */}
        
      </div>
    </nav>
  );
};

export default Navbar;