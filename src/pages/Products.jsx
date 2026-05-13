import React, { useState } from "react";
import Card from "../components/Card";
import { motion } from "motion/react";
import useAxiosInstance from "../Hooks/useAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import useTitle from "../Hooks/useTitle";
import ProductFeatureSection from "../components/ProductFeatureSection";

const Products = () => {
 const axiosInstance = useAxiosInstance()
 const [currentPage, setCurrentPage] = useState(1)
 const [searchParams] = useSearchParams()

 const searchQuery = searchParams.get('search') || ''

 // Sorting + Filtering
 const [sortBy, setSortBy] = useState('')
 const [sortOrder, setSortOrder] = useState('asc')
 const [category, setCategory] = useState('')

 // React Query
 const {
   data: products = [],
   isPending,
   isError,
   error
 } = useQuery({
   queryKey: ['products', searchQuery, sortBy, sortOrder, category],

   queryFn: async () => {
     const res = await axiosInstance.get(
       `/products?search=${encodeURIComponent(
         searchQuery
       )}&sortBy=${sortBy}&sortOrder=${sortOrder}&category=${category}`
     )

     // Safe Array Return
     return Array.isArray(res.data)
       ? res.data
       : Array.isArray(res.data.products)
         ? res.data.products
         : []
   },

   staleTime: 1000 * 60 * 5
 })

 // Dynamic Title
 useTitle(searchQuery ? `Search: ${searchQuery}` : 'All Products | FreshCart')

 // Loading
 if (isPending) return <LoadingSpinner />

 // Error
 if (isError) {
   return (
     <p className="text-center text-red-500 mt-10">
       Failed to load products: {error?.message}
     </p>
   )
 }

 // Safe Products
 const safeProducts = Array.isArray(products) ? products : []

 // Pagination
 const itemsPerPage = 20

 const totalPages = Math.ceil(safeProducts.length / itemsPerPage)

 const indexOfLast = currentPage * itemsPerPage

 const indexOfFirst = indexOfLast - itemsPerPage

 const currentProducts = safeProducts.slice(indexOfFirst, indexOfLast)

 // Page Change
 const handlePageChange = page => {
   if (page >= 1 && page <= totalPages) {
     setCurrentPage(page)

     window.scrollTo({
       top: 0,
       behavior: 'smooth'
     })
   }
 }

  return (
    <section>
      <div className="py-3 md:pt-2 md:pb-10">
        {/* ===== Modern Hero Banner ===== */}
        <div className="relative overflow-hidden rounded-2xl min-h-[650px] lg:min-h-[720px] bg-[#07140d] py-5">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop"
            alt="Organic Products"
            className="absolute inset-0 w-full h-full object-cover scale-110 opacity-30"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07140d] via-[#07140d]/80 to-[#07140d]/40" />

          {/* Glow Effects */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-500/20 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-400/20 blur-[130px]" />

          {/* Floating Blur Ball */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity
            }}
            className="absolute top-20 right-20 w-32 h-32 rounded-full bg-green-400/20 blur-3xl"
          />

          {/* Main Content */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 px-6 md:px-10 lg:px-16 py-16 lg:py-0 min-h-[650px]">
            {/* LEFT CONTENT */}
            <div className="max-w-2xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-green-400/20 bg-green-500/10 backdrop-blur-xl mb-6"
              >
                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                <span className="text-green-300 text-sm font-semibold tracking-wide">
                  Premium Organic Marketplace
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-tight text-white"
              >
                Fresh Food
                <span className="block text-green-400">Better Lifestyle</span>
              </motion.h1>

              {/* Dynamic Search Title */}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-gray-300 mt-5 font-medium"
              >
                {searchQuery
                  ? `Showing results for "${searchQuery}"`
                  : 'Discover premium organic groceries from trusted local farms.'}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-7 text-gray-400 leading-relaxed text-sm md:text-lg max-w-xl"
              >
                Experience the future of grocery shopping with GreenBasket.
                Fresh vegetables, organic fruits, dairy products, and healthy
                essentials delivered to your doorstep with ultra-fast delivery
                and premium quality assurance.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mt-10"
              >
                <button className="group h-14 px-8 rounded-2xl bg-green-500 hover:bg-green-400 transition-all duration-300 text-white font-semibold flex items-center justify-center gap-3 shadow-2xl shadow-green-500/30">
                  Shop Now
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>

                <button className="h-14 px-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl transition-all duration-300 text-white font-semibold">
                  Explore Products
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-4 mt-12"
              >
                {[
                  ['25K+', 'Happy Customers'],
                  ['500+', 'Organic Products'],
                  ['99%', 'Fresh Quality']
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-5 text-center"
                  >
                    <h3 className="text-2xl md:text-3xl font-black text-green-400">
                      {item[0]}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                      {item[1]}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Main Product Image */}
              <motion.img
                animate={{
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity
                }}
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1200&auto=format&fit=crop"
                alt="Fresh Grocery"
                className="w-full max-w-[580px] rounded-[40px] object-cover shadow-[0_20px_80px_rgba(34,197,94,0.25)] border border-white/10"
              />

              {/* Floating Card 1 */}
              <motion.div
                animate={{
                  y: [0, -12, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
                className="absolute top-10 -left-4 md:-left-10 hidden md:block rounded-3xl border border-white/10 bg-[#0d1d14]/90 backdrop-blur-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
                    <span className="text-2xl">🥦</span>
                  </div>

                  <div>
                    <h4 className="text-white font-bold text-lg">
                      100% Organic
                    </h4>

                    <p className="text-sm text-gray-400">
                      Fresh from local farms
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                animate={{
                  y: [0, 12, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity
                }}
                className="absolute hidden md:block bottom-10 -right-2 md:-right-8 rounded-3xl border border-white/10 bg-[#0d1d14]/90 backdrop-blur-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-2xl">🚚</span>
                  </div>

                  <div>
                    <h4 className="text-white font-bold text-lg">
                      Fast Delivery
                    </h4>

                    <p className="text-sm text-gray-400">
                      Delivered within hours
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ===== Filter & Sort Controls ===== */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-8 mb-4">
          {/* Sort by */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
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
            onChange={e => setSortOrder(e.target.value)}
            className="select select-bordered w-44"
          >
            <option value="asc">Ascending ↑</option>
            <option value="desc">Descending ↓</option>
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
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
              {[...Array(totalPages).keys()].map(num => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num + 1)}
                  className={`join-item btn ${
                    currentPage === num + 1 ? 'btn-active btn-primary' : ''
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
      <ProductFeatureSection/>
    </section>
  )
};

export default Products;
