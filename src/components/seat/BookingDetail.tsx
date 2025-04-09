import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ShowInfo {
    movieTitle: string;
    date: string;
    time: string;
}

interface Ticket {
    seat_number: string;
    price: number;
    show_id: string;
}

interface OrderData {
    amount: number;
    payment_method: string;
    transaction_id: string;
    tickets: Ticket[];
}

interface PaymentResponse {
    paymentUrl?: string;
    message?: string;
}

const BookingDetail: React.FC = () => {
    const location = useLocation();
    const [showInfo] = useState<ShowInfo>({
        movieTitle: "Fast & Furious 10",
        date: "Thứ bảy, 20/04/2025",
        time: "19:30"
    });

    const params = new URLSearchParams(location.search);
    const showId = params.get("show_id") || "";
    const seatNumbers: string[] = params.get("seat_numbers")?.split(",") || [];
    const total: number = parseInt(params.get("price") || "0") || 0;
    const seatCount: number = seatNumbers.length;
    const baseTotal: number = Math.floor(total / 1.06);
    const serviceFee: number = total - baseTotal;

    const handlePayment = async () => {
        const transactionId: string = Date.now().toString();
        const orderData: OrderData = {
            amount: total,
            payment_method: "credit_card",
            transaction_id: transactionId,
            tickets: seatNumbers.map(seat => ({
                seat_number: seat,
                price: Math.floor(total / seatNumbers.length),
                show_id: showId
            }))
        };

        try {
            const orderResponse = await fetch("https://backendmovie-10gn.onrender.com/api/orders", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const orderResult = await orderResponse.json();
            if (!orderResponse.ok) {
                alert("Lỗi tạo đơn hàng: " + (orderResult.message || "Không rõ lỗi."));
                return;
            }

            const orderId = orderResult.order_id || "1";
            const paymentData = {
                order_id: orderId,
                amount: total,
                payment_method: "credit_card",
                transaction_id: transactionId,
                return_url: `${window.location.origin}/payment?order_id=${orderId}&transaction_id=${transactionId}`
            };

            const paymentResponse = await fetch("https://backendmovie-10gn.onrender.com/api/payments", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });

            const paymentResult: PaymentResponse = await paymentResponse.json();

            if (paymentResult.paymentUrl) {
                window.location.href = paymentResult.paymentUrl;
            } else {
                alert("Lỗi thanh toán: " + (paymentResult.message  || "Không rõ lỗi."));
            }
        } catch (error) {
            console.error("Lỗi xử lý thanh toán:", error);
            alert("Đã xảy ra lỗi khi xử lý thanh toán.");
        }
    };

    return (
        <div className="bg-gradient-to-br from-black via-gray-900 to-green-900 text-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-xl p-8 rounded-lg shadow-lg bg-black/60">
                <h1 className="text-2xl font-bold mb-6">Booking Detail</h1>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Lịch chiếu</h2>
                    <div className="mb-1">
                        <p className="text-gray-400 text-sm">Tên phim</p>
                        <p className="font-bold">{showInfo.movieTitle}</p>
                    </div>
                    <div className="mb-1">
                        <p className="text-gray-400 text-sm">Ngày</p>
                        <p className="flex justify-between">
                            <span>{showInfo.date}</span>
                            <span className="text-gray-400">Giờ</span>
                            <span className="ml-2">{showInfo.time}</span>
                        </p>
                    </div>
                    <div className="mb-1">
                        <p className="text-gray-400 text-sm">Ghế (<span>{seatCount}</span>)</p>
                        <p className="font-bold">{seatCount ? seatNumbers.join(", ") : "Chưa chọn ghế"}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Chi tiết giao dịch</h2>
                    <div className="flex justify-between text-sm border-b border-gray-700 pb-1">
                        <span>Ghế thường</span>
                        <span>₫{baseTotal.toLocaleString()} ({seatCount} ghế)</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-700 py-1">
                        <span>Phí dịch vụ (6%)</span>
                        <span>₫{serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                        <span>Tổng tiền</span>
                        <span className="text-green-400">₫{total.toLocaleString()}đ</span>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mb-4">*Vé đã mua không thể trả!</p>

                <button
                    onClick={handlePayment}
                    className="w-full bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded text-white font-semibold"
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
};

export default BookingDetail;