// components/MovieTable.tsx
import React from 'react';

interface Movie {
  movie_id: number;
  movie_name: string;
  genre: string;
  duration: string;
  path: string;
}

interface MovieTableProps {
  movies: Movie[];
  onCreate: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MovieTable: React.FC<MovieTableProps> = ({ movies, onCreate, onEdit, onDelete }) => {
  const currentMovies = movies; // Assuming currentMovies is the same as movies for this example
  const indexOfFirstMovie = 0; // Assuming indexOfFirstMovie is 0 for this example

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Movies</h2>
        <button
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600"
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
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">Cover</th>
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">Name</th>
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">Genre</th>
              <th className="p-2 text-xs sm:text-sm text-left border border-gray-300">Duration</th>
              <th className="p-2 text-xs sm:text-sm text-center border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMovies.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No movies available.
                </td>
              </tr>
            ) : (
              currentMovies.map((movie, index) => (
                <tr
                  key={movie.movie_id}
                  className="hover:bg-teal-50 transition-colors duration-200"
                >
                  <td className="p-2 text-center border border-gray-300">
                    {indexOfFirstMovie + index + 1}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <img
                      src={movie.path}
                      alt={movie.movie_name}
                      className="w-16 h-16 object-cover rounded shadow-md"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">{movie.movie_name}</td>
                  <td className="p-2 border border-gray-300">{movie.genre}</td>
                  <td className="p-2 border border-gray-300">{movie.duration}</td>
                  <td className="p-2 border border-gray-300 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600"
                        onClick={() => onEdit(movie.movie_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 text-sm font-medium text-white bg-rose-500 rounded hover:bg-rose-600"
                        onClick={() => onDelete(movie.movie_id)}
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

export default MovieTable;