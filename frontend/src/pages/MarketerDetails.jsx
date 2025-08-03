import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function MarketerDetails() {
  const { id } = useParams();
  const [data, setData] = useState({
    marketer: null,
    campaigns: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [printAfterLoad, setPrintAfterLoad] = useState(false);

  useEffect(() => {
    const fetchMarketerData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Fadlan login samee si aad xogtan u aragto.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`/api/campaigns/marketer-full-data/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(res.data);
        setPrintAfterLoad(true); // set print trigger
      } catch (err) {
        console.error(err);
        setError("Xogta lama heli karo, fadlan isku day mar kale.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketerData();
  }, [id]);

  // Print after data loads successfully
  useEffect(() => {
    if (!loading && !error && printAfterLoad) {
      window.print();
      setPrintAfterLoad(false); // Prevent printing again
    }
  }, [loading, error, printAfterLoad]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const { marketer, campaigns, products } = data;

  return (
    <div className="p-6 print:p-0">
      <h2 className="text-2xl font-bold mb-4">Marketer Details</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">User Info</h3>
        <p>
          <strong>Username:</strong> {marketer.username}
        </p>
        <p>
          <strong>Email:</strong> {marketer.email}
        </p>
        <p>
          <strong>Role:</strong> {marketer.role}
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Campaigns</h3>
        {campaigns.length === 0 ? (
          <p>No campaigns found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Title</th>
                  <th className="border px-3 py-2">Platform</th>
                  <th className="border px-3 py-2">Budget</th>
                  <th className="border px-3 py-2">Spent</th>
                  <th className="border px-3 py-2">Start</th>
                  <th className="border px-3 py-2">End</th>
                  <th className="border px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id}>
                    <td className="border px-3 py-2">{c.title}</td>
                    <td className="border px-3 py-2">{c.platform}</td>
                    <td className="border px-3 py-2">${c.budget}</td>
                    <td className="border px-3 py-2">${c.spent}</td>
                    <td className="border px-3 py-2">
                      {new Date(c.startDate).toLocaleDateString()}
                    </td>
                    <td className="border px-3 py-2">
                      {new Date(c.endDate).toLocaleDateString()}
                    </td>
                    <td className="border px-3 py-2">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Products</h3>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="w-full table-auto border border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="border px-3 py-2">{p.name}</td>
                  <td className="border px-3 py-2">${p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
