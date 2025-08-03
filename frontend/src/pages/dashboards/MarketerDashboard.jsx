import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MarketerDashboard() {
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [campaignRes, productRes, orderRes] = await Promise.all([
          axios.get("/api/campaigns", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/products/my-products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/orders/my-orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCampaignsCount(campaignRes.data.length);
        setProductsCount(productRes.data.length);
        setOrdersCount(orderRes.data.length);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-4">Marketer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="My Campaigns"
          value={campaignsCount}
          color="bg-indigo-600"
        />
        <Card
          title="My Products"
          value={productsCount}
          color="bg-emerald-600"
        />
        <Card
          title="Orders from My Products"
          value={ordersCount}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`p-6 rounded-lg text-white shadow ${color}`}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
