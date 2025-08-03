import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
function customerAccount() {
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch user data");
      });
  }, []);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !user) return;
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setUploading(true);
      const res = await axios.put(
        `http://localhost:5000/api/users/${user.id || user._id}/profile-image`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser((prev) => ({ ...prev, image: res.data.profileImage }));
      toast.success("Sawirka waa la cusbooneysiiyay");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Sawirka lama cusbooneysiin");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <p>Loading...</p>;
  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-semibold">My Account</h1>

      {/* Profile Info */}
      <div className="space-y-2 text-gray-700">
        <img
          src={user.image || "https://i.pravatar.cc/100?u=" + user.email}
          alt="Profile"
          className="w-24 h-24 rounded-full border"
        />
        <p>
          <strong>Name:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* Upload New Image */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Update Profile Image</h2>
        <input type="file" onChange={handleImageChange} />
        <button
          onClick={handleImageUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* Change Password Link */}
      <div className="mt-6">
        <Link
          to="/customer/change-password"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
}

export default customerAccount