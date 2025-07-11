import React from "react";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 shadow-sm px-6 flex items-center justify-between z-50">
      {/* Logo + Brand */}
      <div className="flex items-center space-x-3">
        <button onClick={toggleSidebar} className="lg:hidden text-blue-600">
          ☰
        </button>
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <Link to="/dashboard" className="text-blue-600 font-bold text-xl hover:text-blue-800">
          Expense Tracker
        </Link>
      </div>

      {/* Optional: Add icons or user info on the right */}
    </nav>
  );
};

export default Navbar;
