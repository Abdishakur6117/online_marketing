import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTimes } from "react-icons/fa";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const printRef = useRef();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };


  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      if (!res.data || res.data.length === 0) {
        toast.warn("No products found!");
      }
      console.log("Products fetched:", res.data); // ← Add this
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    }
  };
  
  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingOrder(null);
    setShowModal(true);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };


  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order cancelled");

      // Update order status in state directly:
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: res.data.orderStatus }
            : order
        )
      );

      // Haddii aad rabto, sidoo kale wac fetchOrders si aad u hubiso
      // fetchOrders();
    } catch {
      toast.error("Failed to cancel order");
    }
  };
  
  const handleModalSubmit = async (formData) => {
    try {
      console.log("formData.products", formData.products);
      console.log("products in state", products);

      const detailedProducts = formData.products
        .filter((p) => p.productId && p.quantity > 0)
        .map((p) => {
          const prod = products.find((pr) => pr._id === p.productId);
          return {
            product: p.productId,
            quantity: p.quantity,
            price: prod?.price || 0,
          };
        });
    

      const totalAmount = detailedProducts.reduce(
        (sum, p) => sum + p.quantity * p.price,
        0
      );

      const payload = {
        products: detailedProducts,
        totalAmount,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
      };

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editingOrder) {
        // await axios.put(`/api/orders/${editingOrder._id}`, payload, config);
        await axios.put(
          `http://localhost:5000/api/orders/${editingOrder._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Order updated");
        
      } else {
        // await axios.post(`/api/orders`, payload, config);
        await axios.post("http://localhost:5000/api/orders", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Order added");
      }

      setShowModal(false);
      fetchOrders();
    } catch (err) {
      console.error("Order error:", err);
      toast.error(err.response?.data?.message || "Order operation failed");
    }
  };

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Orders_Report",
    pageStyle: `
      @page { size: auto; margin: 5mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        table { width: 100%; border-collapse: collapse; }
        th { background-color: #f3f4f6 !important; }
        td, th { border: 1px solid #d1d5db; padding: 8px; }
        .no-print { display: none !important; }
      }
    `,
  });

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="space-x-2">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 no-print"
          >
            Add Order
          </button>
        </div>
      </div>

      <div ref={printRef} className="bg-white p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Orders Report</h2>
        {loading ? (
          <div>Loading orders...</div>
        ) : (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Order ID</th>
                <th className="py-2 px-4 border">Products</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border no-print">Actions</th>
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
                    <td className="py-2 px-4 border">{order._id.slice(-6)}</td>
                    <td className="py-2 px-4 border">
                      {order.products.map((p, i) => (
                        <div key={i}>
                          {p.product?.name || "Deleted Product"} x {p.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-4 border">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border">{order.orderStatus}</td>
                    <td className="py-2 px-4 border">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border space-x-2 no-print">
                      <button
                        onClick={() => openEditModal(order)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <OrderModal
          products={products}
          order={editingOrder}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}


function OrderModal({ order, onClose, onSubmit, products }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    products:
      order?.products.map((p) => ({
        productId: p.product?._id || p.product,
        quantity: p.quantity,
      })) || [],
    shippingAddress: order?.shippingAddress || {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    paymentMethod: order?.paymentMethod || "Cash on Delivery",
  });

  const addProduct = () => {
    if (!selectedProductId) {
      alert("Fadlan dooro alaabta!");
      return;
    }
    if (quantity <= 0) {
      alert("Fadlan geli tiro sax ah");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { productId: selectedProductId, quantity }],
    }));
    setSelectedProductId("");
    setQuantity(1);
  };

  const handleShippingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [field]: value },
    }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.products.length === 0) {
      alert("Fadlan ku dar alaab ugu yaraan mid");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 bg-opacity-40">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {order ? "Edit Order" : "Add Order"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Shipping Address</label>
            <input
              type="text"
              placeholder="Street"
              value={formData.shippingAddress.street}
              onChange={(e) => handleShippingChange("street", e.target.value)}
              className="w-full border rounded p-2 mb-2"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={formData.shippingAddress.city}
              onChange={(e) => handleShippingChange("city", e.target.value)}
              className="w-full border rounded p-2 mb-2"
              required
            />
            <input
              type="text"
              placeholder="State"
              value={formData.shippingAddress.state}
              onChange={(e) => handleShippingChange("state", e.target.value)}
              className="w-full border rounded p-2 mb-2"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={formData.shippingAddress.postalCode}
              onChange={(e) =>
                handleShippingChange("postalCode", e.target.value)
              }
              className="w-full border rounded p-2 mb-2"
            />
            <input
              type="text"
              placeholder="Country"
              value={formData.shippingAddress.country}
              onChange={(e) => handleShippingChange("country", e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          {/* Horizontal layout for product selector and quantity */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Add Product</label>
            <div className="flex space-x-2 items-center">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border p-2 flex-grow"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 border p-2"
              />
              <button
                type="button"
                onClick={addProduct}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mb-4">
            <strong>Selected Products:</strong>
            <ul className="list-disc list-inside max-h-32 overflow-auto border p-2 rounded">
              {formData.products.map((p, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>
                    {products.find((pr) => pr._id === p.productId)?.name ||
                      "Unknown"}{" "}
                    x {p.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        products: prev.products.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-red-500 text-sm ml-2 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 shadow"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 shadow"
            >
              {order ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Orders;
