import React from 'react';
import { Show, Movie, Theater } from '../../types';

interface ShowsTableProps {
  shows: Show[];
  movies: Movie[];
  theaters: Theater[];
  onCreate: () => void;
  onEdit: (showId: number) => void;
  onDelete: (showId: number) => void;
}

const ShowsTable: React.FC<ShowsTableProps> = ({ shows, movies, theaters, onCreate, onEdit, onDelete }) => {
  const movieMap = movies.reduce((map: { [key: number]: string }, movie) => {
    map[movie.movie_id] = movie.movie_name;
    return map;
  }, {});

  const theaterMap = theaters.reduce((map: { [key: number]: string }, theater) => {
    map[theater.theater_id] = theater.theater_name;
    return map;
  }, {});

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-teal-500 rounded-lg transition-all cursor-pointer duration-200 ease-in-out hover:bg-teal-600"
          onClick={onCreate}
        >
          + Create New
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse shadow-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">#</th>
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">Movie</th>
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">Theater</th>
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">Show Time</th>
              <th className="p-2 text-xs sm:text-sm text-center border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No shows available.
                </td>
              </tr>
            ) : (
              shows.map((show, index) => (
                <tr key={show.show_id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-2 text-xs sm:text-sm text-left border border-gray-300">
                    {index + 1}
                  </td>
                  <td className="p-2 text-xs sm:text-sm text-left border border-gray-300">
                    {movieMap[show.movie_id] || "N/A"}
                  </td>
                  <td className="p-2 text-xs sm:text-sm text-left border border-gray-300">
                    {theaterMap[show.theater_id] || "N/A"}
                  </td>
                  <td className="p-2 text-xs sm:text-sm text-left border border-gray-300">
                    {show.show_time || "N/A"}
                  </td>
                  <td className="p-2 text-xs sm:text-sm text-center border border-gray-300">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => onEdit(show.show_id)}
                        aria-label="Edit Movie Show"
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => onDelete(show.show_id)}
                        aria-label="Delete Movie Show"
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

export default ShowsTable;