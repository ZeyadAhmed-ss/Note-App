import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
     localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-lg backdrop-blur-md border-b border-white/10 relative overflow-hidden">
      {/* Glow Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-indigo-400/30 blur-2xl animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-white text-3xl font-extrabold tracking-wide drop-shadow-lg cursor-pointer relative group">
          <span className="relative z-10">Note App</span>
          {/* Underline hover effect */}
          <span></span>
        </h1>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="relative text-white font-semibold px-6 py-2 rounded-full shadow-lg 
          bg-gradient-to-r from-purple-600 to-indigo-600 
          transition-all duration-500 ease-in-out transform 
          hover:scale-110 hover:shadow-purple-500/60 overflow-hidden group"
        >
          <span className="relative z-10">Sign Out</span>
          {/* Hover shine effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
        </button>
      </div>
    </nav>
  );
}
