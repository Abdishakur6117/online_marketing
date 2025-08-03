import React, { useEffect, useState } from "react";
import axios from "axios";
function orderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Make sure this is stored at login
      const response = await axios.get(`/api/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <table className="min-w-full border bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Order ID</th>
            <th className="py-2 px-4 border">Products</th>
            <th className="py-2 px-4 border">Total</th>
            <th className="py-2 px-4 border">Payment</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-4">
                You have not placed any orders yet.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border">{order._id}</td>
                <td className="py-2 px-4 border">
                  <ul className="list-disc list-inside">
                    {order.products.map((item, i) => (
                      <li key={i}>
                        {item.product?.name || "Deleted Product"} x{" "}
                        {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4 border">${order.totalAmount}</td>
                <td className="py-2 px-4 border">{order.paymentStatus}</td>
                <td className="py-2 px-4 border">{order.orderStatus}</td>
                <td className="py-2 px-4 border">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default orderDetails