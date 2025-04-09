import { Link } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-black to-green-900 text-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-xl p-8 rounded-lg shadow-lg bg-black/60 text-center">
                <h1 className="text-3xl font-bold mb-6">Thanh toán thành công!</h1>
                <p className="text-xl mb-6">Cảm ơn bạn đã mua vé. Vé của bạn đã được thanh toán thành công.</p>
                <Link to="/home" className="text-lg text-green-500 hover:text-green-400">
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;