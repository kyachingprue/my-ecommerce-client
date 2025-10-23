import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Convert and structure product data
      const newProduct = {
        title: data.title,
        category: data.category,
        price: parseFloat(data.price),
        currency: data.currency || "BDT",
        stock: parseInt(data.stock),
        sku: data.sku,
        weight: data.weight,
        unit: data.unit || "kg",
        seller: {
          name: data.sellerName,
          email: data.sellerEmail,
        },
        description: data.description,
        image: data.image,
        tags: data.tags.split(",").map((tag) => tag.trim()), // comma separated tags
        rating: parseFloat(data.rating) || 0,
        reviewsCount: parseInt(data.reviewsCount) || 0,
        origin: data.origin,
        organic: data.organic === "true" ? true : false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/products", newProduct);
      if (res.data.insertedId) {
        toast.success("✅ Product added successfully!");
        navigate('/dashboard/seller/products')
        reset();
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add product!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 px-4">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-green-200">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
          🌿 Add New Product
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div>
            <label className="font-semibold text-gray-700">Title</label>
            <input
              {...register("title", { required: true })}
              placeholder="vegetable name"
              className="w-full border border-green-300 focus:ring-2 focus:ring-green-500 p-3 rounded-lg"
            />
            {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold text-gray-700">Category</label>
            <input
              {...register("category", { required: true })}
              placeholder="Vegetable"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold text-gray-700">Price</label>
            <input
              type="number"
              {...register("price", { required: true })}
              placeholder="price"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="font-semibold text-gray-700">Currency</label>
            <input
              {...register("currency")}
              placeholder="BDT"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="font-semibold text-gray-700">Stock</label>
            <input
              type="number"
              {...register("stock", { required: true })}
              placeholder="total stock"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="font-semibold text-gray-700">SKU</label>
            <input
              {...register("sku")}
              placeholder="SKU code"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="font-semibold text-gray-700">Weight</label>
            <input
              {...register("weight")}
              placeholder="weight"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="font-semibold text-gray-700">Unit</label>
            <input
              {...register("unit")}
              placeholder="kg"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Seller Name */}
          <div>
            <label className="font-semibold text-gray-700">Seller Name</label>
            <input
              {...register("sellerName", { required: true })}
              placeholder="user name"
              defaultValue={user?.displayName}
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Seller Email */}
          <div>
            <label className="font-semibold text-gray-700">Seller Email</label>
            <input
              type="email"
              {...register("sellerEmail", { required: true })}
              placeholder="example@gmail.com"
              defaultValue={user?.email}
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="font-semibold text-gray-700">Image URL</label>
            <input
              {...register("image", { required: true })}
              placeholder="https://example.com/example.jpg"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="font-semibold text-gray-700">Description</label>
            <textarea
              {...register("description")}
              placeholder="Fresh and high-quality tomato directly from farms..."
              className="w-full border border-green-300 p-3 rounded-lg h-24"
            ></textarea>
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="font-semibold text-gray-700">Tags (comma separated)</label>
            <input
              {...register("tags")}
              placeholder="fresh,organic,local,vegetable"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="font-semibold text-gray-700">Rating</label>
            <input
              type="number"
              step="0.1"
              {...register("rating")}
              placeholder="rating"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Reviews Count */}
          <div>
            <label className="font-semibold text-gray-700">Reviews Count</label>
            <input
              type="number"
              {...register("reviewsCount")}
              placeholder="reviews count"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Origin */}
          <div>
            <label className="font-semibold text-gray-700">Origin</label>
            <input
              {...register("origin")}
              placeholder="Dhaka, Bangladesh"
              className="w-full border border-green-300 p-3 rounded-lg"
            />
          </div>

          {/* Organic */}
          <div>
            <label className="font-semibold text-gray-700">Organic</label>
            <select {...register("organic")} className="w-full border border-green-300 p-3 rounded-lg">
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg tracking-wide shadow-lg transition-transform transform hover:scale-[1.02]"
            >
              ➕ Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
