import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const handleDelete = async (orderId) => {
    if (window.confirm("Ma hubtaa inaad tirtirayso dalabkan?")) {
      try {
        await axios.delete(`/api/orders/${orderId}`);
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success("Dalabka waa la tirtiray.");
      } catch (error) {
        toast.error("Tirtiriddu way fashilantay.");
      }
    }
  };
  const handleEdit = (order) => {
    setEditingOrder(order);
    setOrderStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
  };
  
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `/api/orders/${editingOrder._id}/status`,
        {
          orderStatus,
          paymentStatus,
        }
      );

      const updatedOrder = response.data.order;
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      toast.success("Dalabka waa la cusboonaysiiyay");
      setEditingOrder(null);
    } catch (error) {
      toast.error("Qalad ayaa dhacay");
    }
  };
    
  
  const closeModal = () => {
    setEditingOrder(null);
  };

  if (loading) return <p className="p-4">Loading orders...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Orders for Your Products</h2>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border">Order ID</th>
            <th className="py-2 px-4 border">Product</th>
            <th className="py-2 px-4 border">Buyer</th>
            <th className="py-2 px-4 border">Quantity</th>
            <th className="py-2 px-4 border">Total</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Order Status</th>
            <th className="py-2 px-4 border">Payment Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4 text-gray-500">
                No orders for your products yet.
              </td>
            </tr>
          ) : (
            orders.map((order) =>
              order.products.map((product, idx) => (
                <tr key={`${order._id}-${idx}`}>
                  <td className="py-2 px-4 border">{order._id}</td>
                  <td className="py-2 px-4 border">
                    {product.product?.name || "N/A"}
                  </td>
                  <td className="py-2 px-4 border">
                    {order.user?.username || "Unknown"}
                  </td>
                  <td className="py-2 px-4 border">{product.quantity}</td>
                  <td className="py-2 px-4 border">
                    $
                    {((product.product?.price || 0) * product.quantity).toFixed(
                      2
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">{order.orderStatus}</td>
                  <td className="py-2 px-4 border">{order.paymentStatus}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleEdit(order)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-bold mb-4">Cusboonaysii Dalab</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium">
                Xaaladda Dalabka
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="mt-1 block w-full border px-2 py-1 rounded"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Bixinta</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="mt-1 block w-full border px-2 py-1 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Update
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductOrders;
