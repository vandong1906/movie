// components/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  navigate: (page: string) => void;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, navigate, handleLogout }) => {
  return (
    <nav
      className={`${
        isOpen ? "block" : "hidden"
      } sm:block bg-gray-100 sm:bg-white border border-black border-opacity-50 w-[277px] transition-transform duration-300 ease-in-out fixed sm:static top-[77px] left-0 h-[calc(100vh-77px)] z-50`}
    >
      <button
        className="p-4 text-lg sm:text-3xl w-full text-left bg-emerald-300"
        onClick={() => navigate('movies')}
      >
        Movies
      </button>
      <button
        className="p-4 text-lg sm:text-3xl w-full text-left hover:bg-gray-100"
        onClick={() => navigate('theaters')}
      >
        Theaters
      </button>
      <button
        className="p-4 text-lg sm:text-3xl w-full text-left hover:bg-gray-100"
        onClick={() => navigate('shows')}
      >
        Shows
      </button>
      <button
        className="p-4 text-lg sm:text-3xl w-full text-left hover:bg-gray-100"
        onClick={() => navigate('orders')}
      >
        Orders
      </button>
      <button
        className="p-4 text-lg sm:text-3xl text-red-500 w-full text-left hover:bg-red-50"
        onClick={handleLogout}
      >
        LogOut
      </button>
    </nav>
  );
};

export default Sidebar;
