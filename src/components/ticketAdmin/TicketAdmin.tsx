import React, { useEffect, useState } from "react";

const API_TICKETS_URL = "https://backendmovie-10gn.onrender.com/api/tickets/";

const AdminTickets: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(API_TICKETS_URL);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      alert("Failed to fetch tickets. Please try again.");
    }
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 p-5 sm:p-14">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Seat</th>
              <th className="p-2 border">Show ID</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No tickets found
                </td>
              </tr>
            ) : (
              currentTickets.map((ticket, index) => (
                <tr key={index}>
                  <td className="p-2 border text-center">{indexOfFirstTicket + index + 1}</td>
                  <td className="p-2 border">{ticket.user_id || "N/A"}</td>
                  <td className="p-2 border">{ticket.seat_number || "N/A"}</td>
                  <td className="p-2 border">{ticket.show_id || "N/A"}</td>
                  <td className="p-2 border">{ticket.price || "N/A"}</td>
                  <td className="p-2 border text-center">{ticket.status || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(tickets.length / ticketsPerPage)}
          </span>
          <button
            disabled={currentPage === Math.ceil(tickets.length / ticketsPerPage)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminTickets;
