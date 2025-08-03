import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SearchMarketers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [marketers, setMarketers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const tableRef = useRef();
  const navigate = useNavigate();

  const handleSearch = async () => {
    setHasSearched(false);
    setError("");
    setMarketers([]);

    if (!searchTerm.trim()) {
      setError("Fadlan geli magac ama email");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/users/marketers/search?query=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMarketers(res.data);
    } catch (err) {
      console.log("API error details:", err.response?.data);
      if (err.response?.status === 404) {
        setMarketers([]);
      } else {
        setError("Server error, fadlan isku day mar kale.");
      }
    } finally {
      setHasSearched(true);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Search Marketers</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter marketer name or email"
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
          {marketers.length > 0 ? (
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
                  {marketers.map((m) => (
                    <tr key={m._id}>
                      <td className="border px-3 py-2">{m.username}</td>
                      <td className="border px-3 py-2">{m.email}</td>
                      <td className="border px-3 py-2">{m.role}</td>
                      <td className="border px-3 py-2 text-center">
                        <button
                          onClick={() => navigate(`/marketerDetails/${m._id}`)}
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
            <p className="text-red-500">Ma jiro suuqgeeye la helay.</p>
          )}
        </>
      )}
    </div>
  );
}
