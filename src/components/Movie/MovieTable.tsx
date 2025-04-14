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
      <div className="flex justify-end mb-6">
        <button
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
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
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px]">Cover</th>
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px]">Name</th>
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px]">Genre</th>
              <th className="p-1.5 text-xs sm:text-sm text-left border-black border-[0.4px]">Duration</th>
              <th className="p-1.5 text-xs sm:text-sm text-center border-black border-[0.4px]">Action</th>
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
                <tr key={movie.movie_id}>
                  <td className="p-2 text-center border border-gray-300">{indexOfFirstMovie + index + 1}</td>
                  <td className="p-2 border border-gray-300">
                    <img src={movie.path} alt={movie.movie_name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="p-2 border border-gray-300">{movie.movie_name}</td>
                  <td className="p-2 border border-gray-300">{movie.genre}</td>
                  <td className="p-2 border border-gray-300">{movie.duration}</td>
                  <td className="p-2 border border-gray-300 text-center">
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => onEdit(movie.movie_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => onDelete(movie.movie_id)}
                    >
                      Delete
                    </button>
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