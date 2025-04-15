// components/Sidebar.tsx
import React from "react";
import { FaFilm, FaTheaterMasks, FaTicketAlt, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa";

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
      } sm:block bg-gray-100 sm:bg-white border border-gray-300 w-[250px] transition-transform duration-300 ease-in-out fixed sm:static top-[77px] left-0 h-[calc(100vh-77px)] z-50`}
    >
      <ul className="flex flex-col">
        <li>
          <button
            className="flex items-center p-4 text-lg sm:text-xl w-full text-left hover:bg-gray-200"
            onClick={() => navigate("admin/movies")}
          >
            <FaFilm className="mr-3 text-blue-500" />
            Movies
          </button>
        </li>
        <li>
          <button
            className="flex items-center p-4 text-lg sm:text-xl w-full text-left hover:bg-gray-200"
            onClick={() => navigate("admin/theaters")}
          >
            <FaTheaterMasks className="mr-3 text-green-500" />
            Theaters
          </button>
        </li>
        <li>
          <button
            className="flex items-center p-4 text-lg sm:text-xl w-full text-left hover:bg-gray-200"
            onClick={() => navigate("admin/shows")}
          >
            <FaCalendarAlt className="mr-3 text-purple-500" />
            Shows
          </button>
        </li>
        <li>
          <button
            className="flex items-center p-4 text-lg sm:text-xl w-full text-left hover:bg-gray-200"
            onClick={() => navigate("admin/tickets")}
          >
            <FaTicketAlt className="mr-3 text-yellow-500" />
            Tickets
          </button>
        </li>
        <li>
          <button
            className="flex items-center p-4 text-lg sm:text-xl text-red-500 w-full text-left hover:bg-red-50"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-3" />
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
