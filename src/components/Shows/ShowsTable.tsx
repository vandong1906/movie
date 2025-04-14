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
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg transition-all cursor-pointer duration-200 ease-in-out hover:bg-blue-600"
          onClick={onCreate}
        >
          + Create New
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px] bg-gray-200 text-gray-800">#</th>
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px] bg-gray-200 text-gray-800">Movie</th>
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px] bg-gray-200 text-gray-800">Theater</th>
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px] bg-gray-200 text-gray-800">Show Time</th>
              <th className="p-1.5 text-xs sm:text-sm text-center border-black border-[0.4px] bg-gray-200 text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center p-4 text-gray-500">
                  No shows available.
                </td>
              </tr>
            ) : (
              shows.map((show, index) => (
                <tr key={show.show_id}>
                  <td className="p-1.5 text-xs text-left border-solid border-[0.4px] border-black">{index + 1}</td>
                  <td className="p-1.5 text-xs text-left border-solid border-[0.4px] border-black">{movieMap[show.movie_id] || "N/A"}</td>
                  <td className="p-1.5 text-xs text-left border-solid border-[0.4px] border-black">{theaterMap[show.theater_id] || "N/A"}</td>
                  <td className="p-1.5 text-xs text-left border-solid border-[0.4px] border-black">{show.show_time || "N/A"}</td>
                  <td className="p-1.5 text-xs text-center border-solid border-[0.4px] border-black">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => onEdit(show.show_id)}
                        aria-label="Edit Movie Show"
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
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