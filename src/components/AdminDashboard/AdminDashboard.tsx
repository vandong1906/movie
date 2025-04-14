// components/AdminDashboard.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../siderBar/Sidebar'; // Adjust the import path as necessary
import './inde.css'
const AdminDashboard: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    console.log("Logging out...");
    
  };

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
    setIsMobileMenuOpen(false); 
  };

  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-11 w-full border border-black border-opacity-50 h-[77px] bg-gray-800">
        <button
          className="p-2 bg-transparent cursor-pointer border-none sm:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="text-xl sm:text-2xl font-medium text-white bg-emerald-400 rounded-full h-[40px] sm:h-[50px] w-[40px] sm:w-[50px] flex items-center justify-center">
          A
        </div>
        <h1 className="text-lg sm:text-3xl font-medium text-white">Administrator</h1>
      </header>

      <div className="flex">
        <Sidebar
          isOpen={isMobileMenuOpen}
          navigate={handleNavigate}
          handleLogout={handleLogout}
        />
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 sm:bg-gray-100">
          <Outlet /> 
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;