// components/TheaterTable.tsx
import React from 'react';

interface Theater {
  theater_id: number;
  theater_name: string;
  location: string;
}

interface TheaterTableProps {
  theaters: Theater[];
  onCreate: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TheaterTable: React.FC<TheaterTableProps> = ({ theaters, onCreate, onEdit, onDelete }) => {
  const currentTheaters = theaters; // Assuming currentTheaters is derived from theaters
  const indexOfFirstTheater = 0; // Assuming indexOfFirstTheater is defined somewhere

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Theaters</h2>
        <button
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-teal-500 rounded-lg transition-all duration-200 ease-in-out hover:bg-teal-600"
          onClick={onCreate}
        >
          + Create New
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse shadow-lg">
          <thead>
            <tr className="bg-teal-100 text-gray-800">
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">#</th>
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">Name</th>
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">Location</th>
              <th className="p-2 text-xs sm:text-sm text-center border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTheaters.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No theaters available.
                </td>
              </tr>
            ) : (
              currentTheaters.map((theater, index) => (
                <tr
                  key={theater.theater_id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-2 text-center border border-gray-300">
                    {indexOfFirstTheater + index + 1}
                  </td>
                  <td className="p-2 border border-gray-300">{theater.theater_name}</td>
                  <td className="p-2 border border-gray-300">{theater.location}</td>
                  <td className="p-2 border border-gray-300">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => onEdit(theater.theater_id)}
                        aria-label={`Edit ${theater.theater_name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => onDelete(theater.theater_id)}
                        aria-label={`Delete ${theater.theater_name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TheaterTable;