import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Product fetch error:", err));
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-600 text-lg">Loading product details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-block text-blue-600 hover:text-blue-800 font-medium mb-6 transition duration-200"
      >
        ← Back to Home
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Product Images */}
        <div className="space-y-6">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full h-[26rem] object-cover rounded-xl shadow-md transition duration-300 hover:scale-105"
          />

          {/* Additional thumbnails */}
          <div className="flex flex-wrap gap-4">
            {product.images?.slice(1).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Product view ${idx + 2}`}
                className="w-24 h-24 object-cover rounded border hover:scale-105 transition duration-300"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            {product.name}
          </h1>
          <p className="text-2xl text-blue-600 font-semibold mb-4">
            ${product.price}
          </p>

          <p className="text-gray-700 text-base leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
            <div>
              <span className="font-medium text-gray-800">Category:</span>{" "}
              {product.category}
            </div>
            <div>
              <span className="font-medium text-gray-800">Stock:</span>{" "}
              {product.stock}
            </div>
            <div>
              <span className="font-medium text-gray-800">Uploaded by:</span>{" "}
              {product.createdBy?.username || "Unknown"}
            </div>
            <div>
              <span className="font-medium text-gray-800">Email:</span>{" "}
              {product.createdBy?.email || "N/A"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
