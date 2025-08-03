import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Fetch products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));

    // Fetch campaigns
    fetch("/api/campaigns/all")
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const isDev = process.env.NODE_ENV === "development"; // optional dev check

        const activeCampaigns = data.filter(
          (campaign) =>
            (campaign.status === "Active" ||
              isDev ||
              campaign.status === "Draft") &&
            new Date(campaign.startDate) <= now &&
            new Date(campaign.endDate) >= now
        );
        

        setCampaigns(activeCampaigns);
      })
      .catch((err) => console.error("Error fetching campaigns:", err));
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-100 via-white to-blue-50 py-20 rounded-3xl shadow-xl mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6">
            {/* Left Text Column */}
            <div className="animate-fade-in-up">
              <h1 className="text-5xl font-extrabold text-blue-900 mb-6 leading-tight drop-shadow-sm">
                Elevate Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-800">
                  Digital Marketing
                </span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-md leading-relaxed">
                Welcome to{" "}
                <span className="font-semibold text-blue-700">MyMarket</span> —
                where campaigns meet customers. Discover powerful tools, market
                smarter, and grow your reach online.
              </p>
              <a
                href="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl transition duration-300"
              >
                🚀 Get Started
              </a>
            </div>

            {/* Right Image Column */}
            <div className="flex justify-center md:justify-end animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                alt="Digital Marketing"
                className="rounded-2xl shadow-2xl w-full h-auto max-w-md"
              />
            </div>
          </div>
        </section>

        {/* Products */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            🛍️ Featured Products
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((p) => (
                <Link to={`/product/${p._id}`} key={p._id}>
                  <div className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer">
                    <img
                      src={p.images?.[0] || "https://via.placeholder.com/300"}
                      alt={p.name}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {p.name}
                    </h3>
                    <p className="text-gray-600 mb-1">${p.price}</p>
                    <span className="text-sm text-gray-500">
                      By {p.createdBy.username}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Home;
