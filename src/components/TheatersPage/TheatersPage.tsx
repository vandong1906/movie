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

  return (
    <>
      <TheaterTable
        theaters={theaters}
        onCreate={() => setIsModalOpen(true)}
        onEdit={(id:number) => {
          setEditingTheaterId(id);
          setIsModalOpen(true);
        }}
        onDelete={(id:number) => {
          if (window.confirm("Are you sure you want to delete this theater?")) {
            fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" })
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