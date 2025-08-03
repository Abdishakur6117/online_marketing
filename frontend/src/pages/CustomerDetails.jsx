import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function CustomerDetails() {
  const { id } = useParams(); // customer ID
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const marketerId = localStorage.getItem("userId");

        if (!token || !marketerId) {
          setError("Fadlan login samee si aad xogtan u aragto.");
          setLoading(false);
          return;
        }

        // ✅ 1. Fetch customer user data
        const userRes = await axios.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ 2. Fetch orders related to marketer’s products
        // ✅ use this if your backend route is just /my-orders
        // badal request-kaan:
        const ordersRes = await axios.get(`/api/orders/my-orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ 3. Clean/filter orders for marketer-specific products
        const cleanedOrders = ordersRes.data
          .map((order) => {
            const filteredProducts = order.products.filter(
              (p) => p.product !== null && p.product.createdBy === marketerId
            );
            return { ...order, products: filteredProducts };
          })
          .filter((order) => order.products.length > 0);

        setUser(userRes.data);
        setOrders(cleanedOrders);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Xogta lama heli karo, fadlan isku day mar kale.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!loading && user && orders.length >= 0) {
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, user, orders]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #printable-content, #printable-content * {
          visibility: visible;
        }
        #printable-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div id="printable-content" ref={printRef}>
        <h2 className="text-2xl font-bold mb-4">Customer Details</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">User Info</h3>
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <table className="w-full table-auto border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">#</th>
                  <th className="border px-3 py-2">Product</th>
                  <th className="border px-3 py-2">Price</th>
                  <th className="border px-3 py-2">Quantity</th>
                  <th className="border px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, orderIndex) =>
                  order.products.map((p, productIndex) => (
                    <tr key={`${order._id}-${productIndex}`}>
                      {productIndex === 0 && (
                        <td
                          className="border px-3 py-2 align-top"
                          rowSpan={order.products.length}
                        >
                          {orderIndex + 1}
                        </td>
                      )}
                      <td className="border px-3 py-2">
                        {p.product?.name || (
                          <span className="text-red-500 italic">
                            Product not found
                          </span>
                        )}
                      </td>
                      <td className="border px-3 py-2 text-right">
                        {p.product ? `$${p.product.price}` : "-"}
                      </td>
                      <td className="border px-3 py-2 text-right">
                        {p.quantity}
                      </td>
                      {productIndex === 0 && (
                        <td
                          className="border px-3 py-2 text-right align-top"
                          rowSpan={order.products.length}
                        >
                          ${order.totalAmount}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
