import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      toast.error("User not logged in or invalid user ID");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user.id}/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Password waa la beddelay");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password lama beddeli karin");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          className="w-full border px-3 py-2 rounded"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
