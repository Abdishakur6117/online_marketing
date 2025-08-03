import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductForm({ editProduct, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || "",
        price: editProduct.price || "",
        description: editProduct.description || "",
        category: editProduct.category || "",
        stock: editProduct.stock || "",
        images: [],
      });
      setPreviewImages(editProduct.images || []);
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        images: [],
      });
      setPreviewImages([]);
    }
  }, [editProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("stock", formData.stock);

    formData.images.forEach((file) => {
      data.append("images", file);
    });

    try {
      if (editProduct) {
        await axios.put(`/api/products/${editProduct._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-6">
      {/* Left: Images */}
      <div className="flex-1">
        <label className="block mb-2 font-semibold">Product Images</label>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
        <div className="flex flex-wrap gap-2">
          {previewImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              className="w-24 h-24 object-cover rounded-md border"
            />
          ))}
        </div>
      </div>

      {/* Right: Inputs */}
      <div className="flex-2 flex flex-col gap-4 w-full">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="p-2 border rounded resize-none"
          rows={3}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">-- Select Category --</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Beauty">Beauty</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editProduct ? "Update" : "Add"} Product
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [toast, setToast] = useState({ message: "", type: "" });

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch {
      showToast("Error fetching products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormSuccess = () => {
    fetchProducts();
    closeModal();
    showToast(
      editProduct
        ? "Product updated successfully"
        : "Product added successfully",
      "success"
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setLoading(true);
    try {
      await axios.delete(`/api/products/${id}`);
      showToast("Product deleted successfully", "success");
      fetchProducts();
    } catch {
      showToast("Failed to delete product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 relative">
      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 rounded shadow-lg text-white font-semibold transition
            ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          role="alert"
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <button
        onClick={openAddModal}
        className="mb-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
      >
        Add Product
      </button>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Images</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">${product.price}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">
                    {product.images?.length > 0
                      ? product.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`${product.name}-${i}`}
                            className="w-12 h-12 object-cover inline-block mr-2 rounded"
                          />
                        ))
                      : "No images"}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>
            <ProductForm
              editProduct={editProduct}
              onSuccess={handleFormSuccess}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
