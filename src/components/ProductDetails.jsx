// src/pages/ProductDetails.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import toast from "react-hot-toast";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useRole from "../Hooks/useRole";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const product = location.state?.product;
  const { role, roleLoading } = useRole();

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl font-semibold">Product not found!</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login first!");
      return;
    }

    // Create order object
    const orderData = {
      productId: product._id.toString(),
      title: product.title,
      category: product.category,
      price: product.price,
      currency: product.currency,
      sku: product.sku,
      image: product.image,
      seller_email: product.seller.email,
      user_email: user.email,
      order_status: "unpaid",
      status: 'pending',
    };

    try {
      const res = await axiosSecure.post("/orders", orderData);

      if (res.data.success) {
        toast.success("✅ Product added to cart!");
        navigate("/dashboard/orders");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full bg-gray-100 justify-between items-center mx-auto p-6 grid md:grid-cols-2 px-5">
      {/* Product Image */}
      <div className="flex w-full md:w-[620px] justify-center items-center">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-96 max-h-[400px] object-cover rounded shadow-lg"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-start">
        <h1 className="text-3xl font-bold pt-6 md:pt-0 text-gray-800">{product.title}</h1>
        <p className="text-gray-500 mt-1">{product.category}</p>

        <div className="flex items-center mt-2 gap-4">
          <span className="text-2xl font-bold text-green-600">
            {product.price} {product.currency}
          </span>
          <span className="text-gray-600">Stock: {product.stock}</span>
        </div>

        <p className="text-gray-500 mt-2">SKU: {product.sku}</p>
        <p className="text-gray-500 mt-2">ProductId: {product._id}</p>
        <p className="text-gray-500 mt-1">Weight: {product.weight} {product.unit}</p>

        <div className="mt-3">
          <p className="text-gray-700 font-semibold">Seller Info:</p>
          <p className="text-gray-500">{product.seller.name}</p>
          <p className="text-gray-500">{product.seller.email}</p>
        </div>

        <div className="mt-3">
          <p className="text-gray-700 font-semibold">Rating:</p>
          <p className="text-yellow-500 font-bold">{product.rating} ⭐ ({product.reviewsCount} reviews)</p>
        </div>

        <div className="mt-4">
          <p className="text-gray-700 font-semibold">Description:</p>
          <p className="text-gray-600 w-full overflow-hidden">{product.description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-5 px-4">
          <button
            onClick={() => navigate(-1)}
            className='mt-6 px-6 py-3 text-xl font-bold rounded w-full md:w-auto transition bg-sky-300 text-gray-700 hover:bg-sky-800 hover:text-white'
          >
            Back products
          </button>
          <button
            onClick={handleAddToCart}
            disabled={roleLoading || role === 'seller' || role === 'admin'}
            className={`mt-6 px-6 py-3 text-xl font-bold rounded w-full md:w-auto transition ${role === 'seller' || role === 'admin'
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-300 text-black hover:bg-blue-400"
              }`}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
