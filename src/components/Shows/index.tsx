import React, { useEffect, useState } from "react";

const SHOWS_API_URL = "https://backendmovie-10gn.onrender.com/api/shows";
const MOVIES_API_URL = "https://backendmovie-10gn.onrender.com/api/movies";
const THEATERS_API_URL = "https://backendmovie-10gn.onrender.com/api/theaters";
const TICKETS_API_URL = "https://backendmovie-10gn.onrender.com/api/tickets";

const AdminShows: React.FC = () => {
  const [shows, setShows] = useState<any[]>([]);
  const [movieMap, setMovieMap] = useState<Record<string, string>>({});
  const [theaterMap, setTheaterMap] = useState<Record<string, string>>({});
  const [showIdToDelete, setShowIdToDelete] = useState<number | null>(null);
  const [editingShowId, setEditingShowId] = useState<number | null>(null);
  const [form, setForm] = useState({ movie_id: "", theater_id: "", show_time: "" });
  const [tickets, setTickets] = useState<any[]>([]);
  const [modals, setModals] = useState({ create: false, delete: false, view: false });
  const [currentPage, setCurrentPage] = useState(1); // For shows pagination
  const [ticketsPage, setTicketsPage] = useState(1); // For tickets pagination
  const ticketsPerPage = 10; // Number of tickets per page
  const showsPerPage = 10; // Number of shows per page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchMovies();
    await fetchTheaters();
    await fetchShows();
  };

  const fetchShows = async () => {
    try {
      const res = await fetch(SHOWS_API_URL);
      const data = await res.json();
      setShows(data);
    } catch (err) {
      alert("Failed to fetch shows");
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await fetch(MOVIES_API_URL);
      const data = await res.json();
      const map = data.reduce((acc: any, movie: any) => ({ ...acc, [movie.movie_id]: movie.movie_name }), {});
      setMovieMap(map);
    } catch (err) {
      alert("Failed to fetch movies");
    }
  };

  const fetchTheaters = async () => {
    try {
      const res = await fetch(THEATERS_API_URL);
      const data = await res.json();
      const map = data.reduce((acc: any, theater: any) => ({ ...acc, [theater.theater_id]: theater.theater_name }), {});
      setTheaterMap(map);
    } catch (err) {
      alert("Failed to fetch theaters");
    }
  };

  const openCreateModal = () => {
    setEditingShowId(null);
    setForm({ movie_id: "", theater_id: "", show_time: "" });
    setModals((prev) => ({ ...prev, create: true }));
  };

  const openEditModal = (id: number) => {
    const show = shows.find((s) => s.show_id === id);
    if (!show) return;
    setEditingShowId(id);
    setForm({
      movie_id: show.movie_id,
      theater_id: show.theater_id,
      show_time: show.show_time,
    });
    setModals((prev) => ({ ...prev, create: true }));
  };

  const openDeleteModal = (id: number) => {
    setShowIdToDelete(id);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const confirmDelete = async () => {
    if (!showIdToDelete) return;
    try {
      await fetch(`${SHOWS_API_URL}/${showIdToDelete}`, { method: "DELETE" });
      fetchShows();
      setModals((prev) => ({ ...prev, delete: false }));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingShowId ? "PUT" : "POST";
    const url = editingShowId ? `${SHOWS_API_URL}/${editingShowId}` : SHOWS_API_URL;
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      fetchShows();
      setModals((prev) => ({ ...prev, create: false }));
    } catch (err) {
      alert("Save failed");
    }
  };

  const viewTickets = async (id: number) => {
    try {
      const res = await fetch(`${TICKETS_API_URL}/show/${id}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setTickets([]); // Ensure tickets is an array
        alert("No tickets available for this show.");
        return;
      }

      if (data.length === 0) {
        setTickets([]); // Handle empty tickets
        alert("No tickets available for this show.");
        return;
      }

      setTickets(data);
      setTicketsPage(1); // Reset tickets pagination to the first page
      setModals((prev) => ({ ...prev, view: true }));
    } catch (err) {
      console.error("Error fetching tickets:", err);
      alert("Failed to fetch tickets");
    }
  };

  const indexOfLastTicket = ticketsPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = Array.isArray(tickets) ? tickets.slice(indexOfFirstTicket, indexOfLastTicket) : [];

  const handleTicketsPagination = (direction: "next" | "prev") => {
    if (direction === "next" && ticketsPage < Math.ceil(tickets.length / ticketsPerPage)) {
      setTicketsPage((prev) => prev + 1);
    } else if (direction === "prev" && ticketsPage > 1) {
      setTicketsPage((prev) => prev - 1);
    }
  };

  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = shows.slice(indexOfFirstShow, indexOfLastShow);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-end mb-6">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600"
          onClick={openCreateModal}
        >
          + Create New
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Movie</th>
            <th className="p-2 border">Theater</th>
            <th className="p-2 border">Show Time</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentShows.map((show, index) => (
            <tr key={show.show_id}>
              <td className="p-2 border">{indexOfFirstShow + index + 1}</td>
              <td className="p-2 border">{movieMap[show.movie_id] || "N/A"}</td>
              <td className="p-2 border">{theaterMap[show.theater_id] || "N/A"}</td>
              <td className="p-2 border">{show.show_time}</td>
              <td className="p-2 border text-center">
                <button
                  className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 mr-2"
                  onClick={() => viewTickets(show.show_id)}
                >
                  View
                </button>
                <button
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"
                  onClick={() => openEditModal(show.show_id)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                  onClick={() => openDeleteModal(show.show_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(shows.length / showsPerPage)}
        </span>
        <button
          disabled={currentPage === Math.ceil(shows.length / showsPerPage)}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Create/Edit Modal */}
      {modals.create && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg max-w-md w-full"
          >
            <h2 className="text-xl mb-4">{editingShowId ? "Edit Show" : "Create Show"}</h2>
            <div className="mb-3">
              <label className="block text-sm mb-1">Movie</label>
              <select
                required
                value={form.movie_id}
                onChange={(e) => setForm({ ...form, movie_id: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="" disabled>Select a movie</option>
                {Object.entries(movieMap).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Theater</label>
              <select
                required
                value={form.theater_id}
                onChange={(e) => setForm({ ...form, theater_id: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="" disabled>Select a theater</option>
                {Object.entries(theaterMap).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Show Time</label>
              <input
                type="datetime-local"
                required
                value={form.show_time}
                onChange={(e) => setForm({ ...form, show_time: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setModals({ ...modals, create: false })}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm font-medium text-white bg-teal-500 rounded hover:bg-teal-600"
              >
                {editingShowId ? "Update Show" : "Create Show"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {modals.delete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this show?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setModals({ ...modals, delete: false })}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Tickets Modal */}
      {modals.view && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl mb-4">Tickets for Show</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">User ID</th>
                  <th className="p-2 border">Seat</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No tickets available.
                    </td>
                  </tr>
                ) : (
                  currentTickets.map((ticket, i) => (
                    <tr key={i}>
                      <td className="p-2 border">{indexOfFirstTicket + i + 1}</td>
                      <td className="p-2 border">{ticket.user_id}</td>
                      <td className="p-2 border">{ticket.seat_number}</td>
                      <td className="p-2 border">{ticket.price}</td>
                      <td className="p-2 border">{ticket.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Tickets Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={ticketsPage === 1}
                onClick={() => handleTicketsPagination("prev")}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {ticketsPage} of {Math.ceil(tickets.length / ticketsPerPage)}
              </span>
              <button
                disabled={ticketsPage === Math.ceil(tickets.length / ticketsPerPage)}
                onClick={() => handleTicketsPagination("next")}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="border p-2 rounded"
                onClick={() => {
                  setModals({ ...modals, view: false }); // Close the modal
                  fetchShows(); // Refresh the shows
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShows;
