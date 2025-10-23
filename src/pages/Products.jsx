import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { motion } from "motion/react";
import useAxiosInstance from "../Hooks/useAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import useTitle from "../Hooks/useTitle";

const Products = () => {
  const axiosInstance = useAxiosInstance();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  // ✅ Sorting and Category state
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [category, setCategory] = useState("");

  const {
    data: products = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", searchQuery, sortBy, sortOrder, category],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/products?search=${encodeURIComponent(searchQuery)}&sortBy=${sortBy}&sortOrder=${sortOrder}&category=${category}`
      );
      return res.data;
    },
  });

  useTitle(searchQuery ? `Search: ${searchQuery}` : "All Products | FreshCart");

  useEffect(() => {
    refetch();
  }, [searchQuery, sortBy, sortOrder, category, refetch]);

  if (isPending) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load products: {error.message}
      </p>
    );

  // Pagination
  const itemsPerPage = 20;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  return (
    <div className="pb-10">
      {/* ===== Banner Section ===== */}
      <div className="relative bg-green-700 rounded-md pt-32 text-white py-20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200"
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-4 md:px-10">
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg"
          >
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Discover Fresh Organic Vegetables 🌱"}
          </motion.h1>
        </div>
      </div>

      {/* ===== Filter & Sort Controls ===== */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-8 mb-4">
        {/* Sort by */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered w-44"
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="releaseDate">Newest</option>
          <option value="title">Title</option>
        </select>

        {/* Sort order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="select select-bordered w-44"
        >
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered w-44"
        >
          <option value="">All Categories</option>
          <option value="Vegetable">Vegetable</option>
          <option value="Fruit">Fruit</option>
          <option value="Organic">Organic</option>
          <option value="Herb">Herb</option>
        </select>
      </div>

      {/* ===== Product Grid ===== */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No products found matching “{searchQuery}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 py-6">
          {currentProducts.map((product, index) => (
            <Card key={index} product={product} />
          ))}
        </div>
      )}

      {/* ===== Pagination ===== */}
      {products.length > 0 && (
        <div className="flex justify-center items-center my-10">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num + 1)}
                className={`join-item btn ${currentPage === num + 1 ? "btn-active btn-primary" : ""
                  }`}
              >
                {num + 1}
              </button>
            ))}
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
