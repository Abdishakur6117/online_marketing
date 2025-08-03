import React, { useEffect, useState } from "react";
import axios from "axios";

function CampaignForm({ editCampaign, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "",
    platform: "",
    budget: "",
    startDate: "",
    endDate: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (editCampaign) {
      setFormData({
        title: editCampaign.title || "",
        description: editCampaign.description || "",
        targetAudience: editCampaign.targetAudience || "",
        platform: editCampaign.platform || "",
        budget: editCampaign.budget || "",
        startDate: editCampaign.startDate
          ? editCampaign.startDate.split("T")[0]
          : "",
        endDate: editCampaign.endDate ? editCampaign.endDate.split("T")[0] : "",
        images: [],
      });
      setPreviewImages(editCampaign.images || []);
    } else {
      setFormData({
        title: "",
        description: "",
        targetAudience: "",
        platform: "",
        budget: "",
        startDate: "",
        endDate: "",
        images: [],
      });
      setPreviewImages([]);
    }
  }, [editCampaign]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    // Preview new uploads only
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert("Please fill in required fields");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("targetAudience", formData.targetAudience);
    data.append("platform", formData.platform);
    data.append("budget", formData.budget);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);

    formData.images.forEach((file) => data.append("images", file));

    try {
      if (editCampaign) {
        await axios.put(`/api/campaigns/${editCampaign._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/campaigns", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving campaign");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-6">
      {/* Left: Images */}
      <div className="flex-1">
        <label className="block mb-2 font-semibold">Campaign Images</label>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
        <div className="flex flex-wrap gap-2">
          {previewImages.length > 0 ? (
            previewImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`preview-${i}`}
                className="w-24 h-24 object-cover rounded-md border"
              />
            ))
          ) : (
            <p className="text-gray-500">No images uploaded</p>
          )}
        </div>
      </div>

      {/* Right: Inputs */}
      <div className="flex-2 flex flex-col gap-4 w-full">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
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
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">-- Select Target Audience --</option>
          <option value="Students">Students</option>
          <option value="Professionals">Professionals</option>
          <option value="Parents">Parents</option>
          <option value="Teenagers">Teenagers</option>
          <option value="Seniors">Seniors</option>
        </select>

        <select
          name="platform"
          value={formData.platform}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              platform: e.target.value.trimStart(), // Optional, or use full trim on submit
            }))
          }
          required
          className="p-2 border rounded"
        >
          <option value="">-- Select Platform --</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
          <option value="Google">Google</option>
          <option value="Twitter">Twitter</option>
          <option value="TikTok">TikTok</option>
        </select>

        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={formData.budget}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editCampaign ? "Update" : "Add"} Campaign
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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);

  const [toast, setToast] = useState({ message: "", type: "" });

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/campaigns/all");
      setCampaigns(res.data);
    } catch {
      showToast("Failed to fetch campaigns", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const openAddModal = () => {
    setEditCampaign(null);
    setShowModal(true);
  };

  const openEditModal = (campaign) => {
    setEditCampaign(campaign);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormSuccess = () => {
    fetchCampaigns();
    closeModal();
    showToast(
      editCampaign
        ? "Campaign updated successfully"
        : "Campaign added successfully",
      "success"
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;
    setLoading(true);
    try {
      await axios.delete(`/api/campaigns/${id}`);
      showToast("Campaign deleted successfully", "success");
      fetchCampaigns();
    } catch {
      showToast("Failed to delete campaign", "error");
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

      <h1 className="text-3xl font-bold mb-6">Campaigns</h1>

      <button
        onClick={openAddModal}
        className="mb-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
      >
        Add Campaign
      </button>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Target Audience</th>
              <th className="py-3 px-4 text-left">Platform</th>
              <th className="py-3 px-4 text-left">Budget</th>
              <th className="py-3 px-4 text-left">Start Date</th>
              <th className="py-3 px-4 text-left">End Date</th>
              <th className="py-3 px-4 text-left">Images</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No campaigns found.
                </td>
              </tr>
            )}
            {campaigns.map((camp) => (
              <tr key={camp._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{camp.title}</td>
                <td className="py-2 px-4">{camp.targetAudience}</td>
                <td className="py-2 px-4">{camp.platform}</td>
                <td className="py-2 px-4">${camp.budget}</td>
                <td className="py-2 px-4">{camp.startDate?.split("T")[0]}</td>
                <td className="py-2 px-4">{camp.endDate?.split("T")[0]}</td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap gap-2 max-w-[150px]">
                    {camp.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="campaign"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => openEditModal(camp)}
                      className="bg-yellow-400 px-3 py-1 rounded text-white hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(camp._id)}
                      className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editCampaign ? "Edit Campaign" : "Add Campaign"}
            </h2>
            <CampaignForm
              editCampaign={editCampaign}
              onSuccess={handleFormSuccess}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
