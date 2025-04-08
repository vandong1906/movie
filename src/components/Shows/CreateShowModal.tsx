import React, { useEffect, useState } from 'react';
import { Show, Movie, Theater } from '../../types';

interface CreateShowModalProps {
  onClose: () => void;
  onSave: (showData: Omit<Show, 'show_id'>) => void;
  movies: Movie[];
  theaters: Theater[];
  editingShow?: Show;
}

const CreateShowModal: React.FC<CreateShowModalProps> = ({ onClose, onSave, movies, theaters, editingShow }) => {
  const [formData, setFormData] = useState<Omit<Show, 'show_id'>>({
    movie_id: 0,
    theater_id: 0,
    show_time: '',
  });

  useEffect(() => {
    if (editingShow) {
      setFormData({
        movie_id: editingShow.movie_id,
        theater_id: editingShow.theater_id,
        show_time: editingShow.show_time,
      });
    }
  }, [editingShow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.movie_id || !formData.theater_id || !formData.show_time) {
      alert("Please fill out all fields.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-full sm:max-w-[500px] w-[95%] sm:w-[90%]">
        <h2 className="text-xl sm:text-2xl font-medium mb-5">{editingShow ? "Edit Show" : "Create New Show"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="movieSelect" className="block text-sm mb-2">Movie</label>
            <select
              id="movieSelect"
              name="movie_id"
              value={formData.movie_id}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-gray-300 rounded"
              required
            >
              <option value="" disabled>Select a movie</option>
              {movies.map((movie) => (
                <option key={movie.movie_id} value={movie.movie_id}>
                  {movie.movie_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="theaterSelect" className="block text-sm mb-2">Theater</label>
            <select
              id="theaterSelect"
              name="theater_id"
              value={formData.theater_id}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-gray-300 rounded"
              required
            >
              <option value="" disabled>Select a theater</option>
              {theaters.map((theater) => (
                <option key={theater.theater_id} value={theater.theater_id}>
                  {theater.theater_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="showTimeInput" className="block text-sm mb-2">Show Time</label>
            <input
              id="showTimeInput"
              type="datetime-local"
              name="show_time"
              value={formData.show_time}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-600"
            >
              {editingShow ? "Update Show" : "Create Show"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShowModal;