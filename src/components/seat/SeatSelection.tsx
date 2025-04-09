import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SeatSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const cols: number = 10;
  const seatPrice: number = 70000;
  const serviceFeeRate: number = 0.06;
  const showId: number = 1;

  const formatCurrencyVND = (amount: number): string => {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const calculateTotals = () => {
    const baseTotal = selectedSeats.length * seatPrice;
    const serviceFee = baseTotal * serviceFeeRate;
    const totalWithFee = baseTotal + serviceFee;
    return { baseTotal, serviceFee, totalWithFee };
  };

  const handleSeatClick = (seatNumber: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const clearSelection = () => {
    setSelectedSeats([]);
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế!");
      return;
    }

    try {
      for (const seat of selectedSeats) {
        const response = await fetch("https://backendmovie-10gn.onrender.com/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seat_number: seat,
            price: seatPrice,
            show_id: showId,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Ghế ${seat}: ${error.message || response.statusText}`);
        }
      }

      const { totalWithFee } = calculateTotals();
      const queryParams = new URLSearchParams({
        show_id: showId.toString(),
        seat_numbers: selectedSeats.join(","),
        price: totalWithFee.toString(),
      }).toString();

      navigate(`/booking?${queryParams}`);
    } catch (error) {
      console.error("Lỗi khi đặt vé:", error);
      alert(`Lỗi đặt vé: ${(error as Error).message}`);
    }
  };

  const { baseTotal, serviceFee, totalWithFee } = calculateTotals();

  return (
    <div className="bg-gradient-to-br from-black to-green-900 text-white min-h-screen flex flex-col justify-between">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 self-start">Seat</h2>
        <div className="grid grid-cols-10 gap-2 mb-8">
          {rows.map(row =>
            Array.from({ length: cols }, (_, i) => i + 1).map(col => {
              const seatNumber = `${row}${col}`;
              const isSelected = selectedSeats.includes(seatNumber);
              return (
                <button
                  key={seatNumber}
                  onClick={() => handleSeatClick(seatNumber)}
                  className={`px-4 py-2 rounded transition hover:bg-gray-200 ${
                    isSelected ? 'bg-green-500 text-white' : 'bg-white text-black'
                  }`}
                >
                  {seatNumber}
                </button>
              );
            })
          )}
        </div>
        <button
          onClick={clearSelection}
          className="bg-white text-black px-8 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white transition"
        >
          X
        </button>
      </div>

      <div className="bg-black p-4 flex justify-between items-center text-white">
        <div>
          <p className="text-sm text-gray-400">Tổng tiền</p>
          <div className="text-xl font-bold">
            <div>{formatCurrencyVND(baseTotal)} <span className="text-sm text-gray-400">(vé)</span></div>
            <div>+ {formatCurrencyVND(serviceFee)} <span className="text-sm text-gray-400">(phí 6%)</span></div>
            <div className="font-bold text-green-400 mt-1">{formatCurrencyVND(totalWithFee)} <span className="text-sm text-gray-300">(tổng)</span></div>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400">Ghế</p>
          <p className="text-xl font-bold">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">SHOW ID</p>
          <p className="text-xl font-bold">#{showId}</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-white rounded">Quay lại</button>
          <button
            onClick={handleProceed}
            className="px-6 py-2 bg-green-500 text-black font-semibold rounded hover:bg-green-400 transition"
          >
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;