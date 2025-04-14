// components/MoviesPage.tsx
import React, { useState, useEffect } from 'react';
import MovieTable from './MovieTable';
import CreateMovieModal from './CreateMovieModal';

interface Movie {
  movie_id: number;
  movie_name: string;
  genre: string;
  duration: string;
  path: string;
}

const API_BASE_URL = "https://backendmovie-10gn.onrender.com/api/movies";

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert("Failed to fetch movies. Please try again.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <>
      <MovieTable
        movies={currentMovies}
        onCreate={() => setIsModalOpen(true)}
        onEdit={(id) => {
          setEditingMovieId(id);
          setIsModalOpen(true);
        }}
        onDelete={(id) => {
          if (window.confirm("Are you sure you want to delete this movie?")) {
            fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" })
              .then((response) => {
                if (!response.ok) throw new Error("Failed to delete");
                fetchMovies();
                alert("Movie deleted successfully!");
              })
              .catch((error) => {
                console.error("Error deleting movie:", error);
                alert("Failed to delete movie");
              });
          }
        }}
      />
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(movies.length / moviesPerPage)}
        </span>
        <button
          disabled={currentPage === Math.ceil(movies.length / moviesPerPage)}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {isModalOpen && (
        <CreateMovieModal
          movie={movies.find((m) => m.movie_id === editingMovieId)}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMovieId(null);
          }}
          onSave={() => {
            fetchMovies();
            setIsModalOpen(false);
            setEditingMovieId(null);
          }}
          editingMovieId={editingMovieId}
        />
      )}
    </>
  );
};

export default MoviesPage;