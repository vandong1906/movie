// components/TheatersPage.tsx
import React, { useState, useEffect } from 'react';
import TheaterTable from './TheaterTable';
import CreateTheaterModal from './CreateTheaterModal';

interface Theater {
  theater_id: number;
  theater_name: string;
  location: string;
}

const API_BASE_URL = "https://backendmovie-10gn.onrender.com/api/theaters";

const TheatersPage: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheaterId, setEditingTheaterId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const theatersPerPage = 10;

  const fetchTheaters = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch theaters");
      const data = await response.json();
      setTheaters(data);
    } catch (error) {
      console.error("Error fetching theaters:", error);
      alert("Failed to fetch theaters. Please try again.");
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const indexOfLastTheater = currentPage * theatersPerPage;
  const indexOfFirstTheater = indexOfLastTheater - theatersPerPage;
  const currentTheaters = theaters.slice(indexOfFirstTheater, indexOfLastTheater);

  return (
    <>
      <TheaterTable
        theaters={currentTheaters}
        onCreate={() => setIsModalOpen(true)}
        onEdit={(id: number) => {
          setEditingTheaterId(id);
          setIsModalOpen(true);
        }}
        onDelete={(id: number) => {
          if (window.confirm("Are you sure you want to delete this theater?")) {
            fetch(`${API_BASE_URL}/${id}`, {
              method: "DELETE",
              credentials: "include", // Include cookies in the request
            })
              .then((response) => {
                if (!response.ok) throw new Error("Failed to delete theater");
                fetchTheaters();
                alert("Theater deleted successfully!");
              })
              .catch((error) => {
                console.error("Error deleting theater:", error);
                alert("Failed to delete theater");
              });
          }
        }}
      />
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-4 py-2 text-sm font-medium rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {Math.ceil(theaters.length / theatersPerPage)}
        </span>
        <button
          disabled={currentPage === Math.ceil(theaters.length / theatersPerPage)}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-4 py-2 text-sm font-medium rounded ${
            currentPage === Math.ceil(theaters.length / theatersPerPage)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
      {isModalOpen && (
        <CreateTheaterModal
          theater={theaters.find((t) => t.theater_id === editingTheaterId)}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTheaterId(null);
          }}
          onSave={() => {
            fetchTheaters();
            setIsModalOpen(false);
            setEditingTheaterId(null);
          }}
          editingTheaterId={editingTheaterId}
        />
      )}
    </>
  );
};

export default TheatersPage;