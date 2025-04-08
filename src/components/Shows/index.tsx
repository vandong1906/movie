import React, { useState, useEffect } from 'react';
import ShowsTable from '../Shows/ShowsTable';
import CreateShowModal from '../Shows/CreateShowModal';
import DeleteConfirmModal from '../Shows/DeleteConfirmModal';

import { Show, Movie, Theater } from '../../types';

const SHOWS_API_URL = "https://backendmovie-10gn.onrender.com/api/shows";
const MOVIES_API_URL = "https://backendmovie-10gn.onrender.com/api/movies";
const THEATERS_API_URL = "https://backendmovie-10gn.onrender.com/api/theaters";

const ShowsPage: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [editingShowId, setEditingShowId] = useState<number | null>(null);
  const [showIdToDelete, setShowIdToDelete] = useState<number | null>(null);

  // Fetch shows
  const fetchShows = async () => {
    try {
      const response = await fetch(SHOWS_API_URL);
      if (!response.ok) throw new Error("Failed to fetch shows");
      const data: Show[] = await response.json();
      setShows(data);
    } catch (error) {
      console.error("Error fetching shows:", error);
      alert("Failed to fetch shows.");
    }
  };

  // Fetch movies
  const fetchMovies = async () => {
    try {
      const response = await fetch(MOVIES_API_URL);
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data: Movie[] = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert("Failed to fetch movies.");
    }
  };

  // Fetch theaters
  const fetchTheaters = async () => {
    try {
      const response = await fetch(THEATERS_API_URL);
      if (!response.ok) throw new Error("Failed to fetch theaters");
      const data: Theater[] = await response.json();
      setTheaters(data);
    } catch (error) {
      console.error("Error fetching theaters:", error);
      alert("Failed to fetch theaters.");
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchMovies();
    fetchTheaters();
    fetchShows();
  }, []);

  // Handle create/edit show
  const handleSaveShow = async (showData: Omit<Show, 'show_id'>) => {
    try {
      let response;
      if (editingShowId) {
        // Update existing show
        response = await fetch(`${SHOWS_API_URL}/${editingShowId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(showData),
        });
      } else {
        // Create new show
        response = await fetch(SHOWS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(showData),
        });
      }

      if (!response.ok) throw new Error(editingShowId ? "Failed to update show" : "Failed to create show");

      alert(editingShowId ? "Show updated successfully!" : "Show created successfully!");
      setIsCreateModalOpen(false);
      fetchShows();
    } catch (error) {
      console.error("Error saving show:", error);
      alert(editingShowId ? "Failed to update show." : "Failed to create show.");
    }
  };

  // Handle delete show
  const handleDeleteShow = async () => {
    if (!showIdToDelete) return;

    try {
      const response = await fetch(`${SHOWS_API_URL}/${showIdToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete show");

      setIsDeleteModalOpen(false);
      alert("Show deleted successfully!");
      fetchShows();
    } catch (error) {
      console.error("Error deleting show:", error);
      alert("Failed to delete show.");
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-50 sm:bg-gray-100">
      <ShowsTable
        shows={shows}
        movies={movies}
        theaters={theaters}
        onCreate={() => setIsCreateModalOpen(true)}
        onEdit={(showId: number) => {
          setEditingShowId(showId);
          setIsCreateModalOpen(true);
        }}
        onDelete={(showId: number) => {
          setShowIdToDelete(showId);
          setIsDeleteModalOpen(true);
        }}
      />
     
      {/* Modals */}
      {isCreateModalOpen && (
        <CreateShowModal
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingShowId(null);
          }}
          onSave={handleSaveShow}
          movies={movies}
          theaters={theaters}
          editingShow={shows.find((s) => s.show_id === editingShowId)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteShow}
        />
      )}
    </main>
  );
};

export default ShowsPage;