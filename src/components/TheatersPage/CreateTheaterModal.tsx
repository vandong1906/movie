// components/CreateTheaterModal.tsx
import React, { useState, useEffect, FormEvent } from 'react';

interface Theater {
  theater_id?: number;
  theater_name: string;
  location: string;
}

interface CreateTheaterModalProps {
  theater?: Theater;
  onClose: () => void;
  onSave: () => void;
  editingTheaterId: number | null;
}

const API_BASE_URL = "https://backendmovie-10gn.onrender.com/api/theaters";

const CreateTheaterModal: React.FC<CreateTheaterModalProps> = ({ theater, onClose, onSave, editingTheaterId }) => {
  const [theaterName, setTheaterName] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (theater) {
      setTheaterName(theater.theater_name);
      setLocation(theater.location);
    }
  }, [theater]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!theaterName || !location) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch(
        editingTheaterId ? `${API_BASE_URL}/${editingTheaterId}` : API_BASE_URL,
        {
          method: editingTheaterId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            theater_name: theaterName,
            location: location,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(editingTheaterId ? "Failed to update theater" : "Failed to create theater");
      }

      alert(editingTheaterId ? "Theater updated successfully!" : "Theater created successfully!");
      onSave();
    } catch (error) {
      console.error("Error saving theater:", error);
      alert(editingTheaterId ? "Failed to update theater" : "Failed to create theater");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-full sm:max-w-[500px] w-[95%] sm:w-[90%]">
        <h2 className="text-xl sm:text-2xl font-medium mb-5">
          {editingTheaterId ? "Edit Theater" : "Create New Theater"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="theater_name" className="block text-sm mb-2">Theater Name</label>
            <input
              id="theater_name"
              type="text"
              className="w-full p-2 text-sm border border-gray-300 rounded"
              value={theaterName}
              onChange={(e) => setTheaterName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm mb-2">Location</label>
            <input
              id="location"
              type="text"
              className="w-full p-2 text-sm border border-gray-300 rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
              {editingTheaterId ? "Update Theater" : "Create Theater"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTheaterModal;