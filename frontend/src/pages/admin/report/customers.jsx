import { useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const tableRef = useRef();
  const navigate = useNavigate();

  const handleSearch = async () => {
    setHasSearched(false);
    setError("");
    setCustomers([]);

    if (!searchTerm.trim()) {
      setError("Fadlan geli magac ama email");
      return;
    }

    try {
      const res = await axios.get(
        `/api/users/search?query=${encodeURIComponent(searchTerm)}`,
        { withCredentials: true }
      );
      setCustomers(res.data);
    } catch (err) {
      console.log("API error details:", err.response?.data);
      if (err.response?.status === 404) {
        setCustomers([]);
      } else {
        setError("Server error, fadlan isku day mar kale.");
        console.error("API error:", err);
      }
    } finally {
      setHasSearched(true);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Search Customers</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter customer name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`border px-4 py-2 rounded w-full ${
            error ? "border-red-500" : ""
          }`}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {hasSearched && (
        <>
          {customers.length > 0 ? (
            <div ref={tableRef}>
              <table className="w-full table-auto border border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">Username</th>
                    <th className="border px-3 py-2">Email</th>
                    <th className="border px-3 py-2">Role</th>
                    <th className="border px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((u) => (
                    <tr key={u._id}>
                      <td className="border px-3 py-2">{u.username}</td>
                      <td className="border px-3 py-2">{u.email}</td>
                      <td className="border px-3 py-2">{u.role}</td>
                      <td className="border px-3 py-2 text-center">
                        <button
                          onClick={() => navigate(`/customer-details/${u._id}`)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-red-500">No customers found.</p>
          )}
        </>
      )}
    </div>
  );
}
