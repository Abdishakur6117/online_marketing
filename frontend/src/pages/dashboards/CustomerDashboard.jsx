import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerDashboard() {
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/orders/user/${userId}`);
        const orders = res.data || [];
        setOrderCount(orders.length);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Welcome, Customer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="My Orders" value={orderCount} color="bg-cyan-600" />
        <Card title="Wishlist Items" value="5" color="bg-pink-500" />
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`p-6 rounded-lg text-white shadow ${color}`}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
