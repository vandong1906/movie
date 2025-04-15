// components/CreateMovieModal.tsx
import React, { useState, useEffect, FormEvent } from 'react';

interface Movie {
  movie_id?: number;
  movie_name: string;
  genre: string;
  duration: string;
  path?: string;
}

interface CreateMovieModalProps {
  movie?: Movie;
  onClose: () => void;
  onSave: () => void;
  editingMovieId: number | null;
}

const API_BASE_URL = "https://backendmovie-10gn.onrender.com/api/movies";

const CreateMovieModal: React.FC<CreateMovieModalProps> = ({ movie, onClose, onSave, editingMovieId }) => {
  const [movieName, setMovieName] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('No file chosen');

  useEffect(() => {
    if (movie) {
      setMovieName(movie.movie_name);
      setGenre(movie.genre);
      setDuration(movie.duration);
    }
  }, [movie]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!movieName || !genre || !duration || (!editingMovieId && !file)) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("movie_name", movieName);
    formData.append("genre", genre);
    formData.append("duration", duration);
    if (file) formData.append("image", file);

    try {
      const response = await fetch(
        editingMovieId ? `${API_BASE_URL}/${editingMovieId}` : API_BASE_URL,
        {
          method: editingMovieId ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save movie");
      }

      alert(editingMovieId ? "Movie updated successfully!" : "Movie created successfully!");
      onSave();
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Failed to save movie. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-[500px] w-[90%] shadow-lg">
        <h2 className="text-xl sm:text-2xl font-medium mb-5 text-gray-800">
          {editingMovieId ? "Edit Movie" : "Create New Movie"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="movie_name" className="block text-sm font-medium text-gray-700 mb-2">
              Movie Name
            </label>
            <input
              id="movie_name"
              type="text"
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <input
              id="genre"
              type="text"
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="flex items-center">
              <label
                htmlFor="cover"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
              >
                Choose File
              </label>
              <span className="ml-3 text-sm text-gray-500">{fileName}</span>
            </div>
            <input
              id="cover"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              required={!editingMovieId}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration (e.g., 2h 30m)
            </label>
            <input
              id="duration"
              type="text"
              pattern="^[0-9]+h [0-9]+m$"
              title="Please use format: 2h 30m"
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingMovieId ? "Update Movie" : "Create Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMovieModal;