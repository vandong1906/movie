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
      <div className="flex justify-end mb-6">
        <button
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg transition-all cursor-pointer duration-200 ease-in-out hover:bg-blue-600"
          onClick={onCreate}
        >
          + Create New
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px]">#</th>
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px]">Name</th>
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px]">Location</th>
              <th className="p-1.5 text-xs sm:text-sm text-center border-black border-[0.4px]">Action</th>
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
                <tr key={theater.theater_id}>
                  <td className="p-2 text-center border border-gray-300">{indexOfFirstTheater + index + 1}</td>
                  <td className="p-2 border border-gray-300">{theater.theater_name}</td>
                  <td className="p-2 border border-gray-300">{theater.location}</td>
                  <td className="p-2 border border-gray-300">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => onEdit(theater.theater_id)}
                        aria-label={`Edit ${theater.theater_name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
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