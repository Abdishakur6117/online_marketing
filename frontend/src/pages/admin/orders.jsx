import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Qalad helista dalabyada:", error);
        setLoading(false);
      }
    };
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Liiska Dalabyada</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Isticmaale</th>
              <th className="py-2 px-4 border-b">Qiimaha</th>
              <th className="py-2 px-4 border-b">Xaalad</th>
              <th className="py-2 px-4 border-b">Bixinta</th>
              <th className="py-2 px-4 border-b">Tallaabo</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">
                  {order.user?.username || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                <td className="py-2 px-4 border-b">{order.paymentStatus}</td>
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
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Ma jiro dalab.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

export default OrdersList;
