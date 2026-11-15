import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { motion as Motion } from "motion/react";
import useAxiosInstance from "../Hooks/useAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import useTitle from "../Hooks/useTitle";
import ProductFeatureSection from "../components/ProductFeatureSection";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  Leaf,
  RotateCcw,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

const Products = () => {
 const axiosInstance = useAxiosInstance()
 const [currentPage, setCurrentPage] = useState(1)
 const [pageSize, setPageSize] = useState(20)
 const [searchParams, setSearchParams] = useSearchParams()

 const searchQuery = searchParams.get('search') || ''

 // Catalog filters
 const [sortBy, setSortBy] = useState('recommended')
 const [category, setCategory] = useState('')
 const [localSearch, setLocalSearch] = useState('')
 const [minimumPrice, setMinimumPrice] = useState('')
 const [maximumPrice, setMaximumPrice] = useState(0)
 const [minimumRating, setMinimumRating] = useState(0)
 const [inStockOnly, setInStockOnly] = useState(false)
 const [filtersOpen, setFiltersOpen] = useState(false)

 // React Query
 const {
   data: products = [],
   isPending,
   isError,
   error,
   isFetching,
   refetch,
 } = useQuery({
   queryKey: ['products', searchQuery],

   queryFn: async () => {
     const res = await axiosInstance.get(
       `/products?search=${encodeURIComponent(searchQuery)}`
     )

     // Safe Array Return
     return Array.isArray(res.data)
       ? res.data
       : Array.isArray(res.data.products)
         ? res.data.products
         : []
   },

   staleTime: 1000 * 60 * 5,
   retry: false,
 })

 // Dynamic Title
 useTitle(searchQuery ? `Search: ${searchQuery}` : 'Fresh groceries')

 const safeProducts = useMemo(
   () => Array.isArray(products) ? products : [],
   [products]
 )
 const categories = useMemo(
   () => [...new Set(safeProducts.map(product => product.category).filter(Boolean))].sort(),
   [safeProducts]
 )
 const priceCeiling = useMemo(
   () => Math.max(
     1,
     Math.ceil(safeProducts.reduce((maximum, product) => Math.max(maximum, Number(product.price) || 0), 0))
   ),
   [safeProducts]
 )
 const activeMaximumPrice = maximumPrice || priceCeiling

 const filteredProducts = useMemo(() => {
   const search = localSearch.trim().toLowerCase()
   const filtered = safeProducts.filter(product => {
     const price = Number(product.price) || 0
     const rating = Number(product.rating) || 0
     const matchesCategory = !category || product.category === category
     const matchesMinimumPrice = minimumPrice === '' || price >= Number(minimumPrice)
     const matchesMaximumPrice = price <= activeMaximumPrice
     const matchesRating = rating >= minimumRating
     const matchesStock = !inStockOnly || Number(product.stock) > 0
     const searchableText = [
       product.title,
       product.category,
       product.description,
       product.seller?.name,
       ...(Array.isArray(product.tags) ? product.tags : []),
     ]
       .filter(Boolean)
       .join(' ')
       .toLowerCase()

     return (
       matchesCategory &&
       matchesMinimumPrice &&
       matchesMaximumPrice &&
       matchesRating &&
       matchesStock &&
       (!search || searchableText.includes(search))
     )
   })

   return filtered.sort((first, second) => {
     if (sortBy === 'price-low') return (Number(first.price) || 0) - (Number(second.price) || 0)
     if (sortBy === 'price-high') return (Number(second.price) || 0) - (Number(first.price) || 0)
     if (sortBy === 'top-rated') return (Number(second.rating) || 0) - (Number(first.rating) || 0)
     if (sortBy === 'name') return String(first.title || '').localeCompare(String(second.title || ''))
     if (sortBy === 'newest') {
       return new Date(second.releaseDate || second.createdAt || 0) - new Date(first.releaseDate || first.createdAt || 0)
     }
     return 0
   })
 }, [safeProducts, localSearch, category, minimumPrice, activeMaximumPrice, minimumRating, inStockOnly, sortBy])

 useEffect(() => {
   setCurrentPage(1)
 }, [searchQuery, localSearch, category, minimumPrice, maximumPrice, minimumRating, inStockOnly, sortBy, pageSize])

 useEffect(() => {
   setMaximumPrice(priceCeiling)
 }, [priceCeiling])

 // Loading
 if (isPending) return <LoadingSpinner />

 // Error
 if (isError && products.length === 0) {
   return (
     <main className="relative my-8 flex min-h-[50vh] items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-50 via-white to-lime-100 px-4 py-12 sm:my-12 sm:rounded-[2rem] sm:px-6">
       <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
       <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-lime-300/25 blur-3xl" />
       <div className="relative w-full max-w-lg rounded-[1.75rem] border border-white/80 bg-white/90 p-6 text-center shadow-2xl shadow-emerald-950/10 backdrop-blur sm:p-10">
         <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-800">
           <Leaf size={27} />
         </span>
         <span className="mt-5 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
           Fresh finds are taking a break
         </span>
         <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
           We couldn’t load products
         </h1>
         <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
           The product service may be temporarily unavailable. Reload the catalog to check for the latest products.
         </p>
         {error?.response?.data?.message && (
           <p role="status" className="mt-3 text-xs text-slate-500">
             {error.response.data.message}
           </p>
         )}
         <button
           type="button"
           onClick={() => refetch()}
           disabled={isFetching}
           className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
         >
           <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
           {isFetching ? "Reloading data..." : "Reload products"}
         </button>
       </div>
     </main>
   )
 }

 // Pagination
 const itemsPerPage = pageSize === 'all'
   ? Math.max(filteredProducts.length, 1)
   : pageSize

 const totalPages = filteredProducts.length
   ? Math.ceil(filteredProducts.length / itemsPerPage)
   : 0

 const indexOfLast = currentPage * itemsPerPage

 const indexOfFirst = indexOfLast - itemsPerPage

 const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast)
 const firstVisibleProduct = filteredProducts.length ? indexOfFirst + 1 : 0
 const lastVisibleProduct = Math.min(indexOfLast, filteredProducts.length)

 const resetFilters = () => {
   setCategory('')
   setLocalSearch('')
   setMinimumPrice('')
   setMaximumPrice(priceCeiling)
   setMinimumRating(0)
   setInStockOnly(false)
   setSortBy('recommended')
   const nextParams = new URLSearchParams(searchParams)
   nextParams.delete('search')
   setSearchParams(nextParams)
 }

 const scrollToCatalog = () => {
   document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' })
 }

 // Page Change
 const handlePageChange = page => {
   if (page >= 1 && page <= totalPages) {
     setCurrentPage(page)
     scrollToCatalog()
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
          <Motion.div
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
              <Motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-green-400/20 bg-green-500/10 backdrop-blur-xl mb-6"
              >
                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                <span className="text-green-300 text-sm font-semibold tracking-wide">
                  Premium Organic Marketplace
                </span>
              </Motion.div>

              {/* Heading */}
              <Motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-tight text-white"
              >
                Fresh Food
                <span className="block text-green-400">Better Lifestyle</span>
              </Motion.h1>

              {/* Dynamic Search Title */}
              <Motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-gray-300 mt-5 font-medium"
              >
                {searchQuery
                  ? `Showing results for "${searchQuery}"`
                  : 'Discover premium organic groceries from trusted local farms.'}
              </Motion.h2>

              {/* Description */}
              <Motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-7 text-gray-400 leading-relaxed text-sm md:text-lg max-w-xl"
              >
                Experience the future of grocery shopping with GreenBasket.
                Fresh vegetables, organic fruits, dairy products, and healthy
                essentials delivered to your doorstep with ultra-fast delivery
                and premium quality assurance.
              </Motion.p>

              {/* Buttons */}
              <Motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mt-10"
              >
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="group h-14 px-8 rounded-2xl bg-green-500 hover:bg-green-400 transition-all duration-300 text-white font-semibold flex items-center justify-center gap-3 shadow-2xl shadow-green-500/30"
                >
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

                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="h-14 px-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl transition-all duration-300 text-white font-semibold"
                >
                  Explore Products
                </button>
              </Motion.div>

              {/* Stats */}
              <Motion.div
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
              </Motion.div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <Motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Main Product Image */}
              <Motion.img
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
              <Motion.div
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
              </Motion.div>

              {/* Floating Card 2 */}
              <Motion.div
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
              </Motion.div>
            </Motion.div>
          </div>
        </div>

        <section id="product-catalog" className="scroll-mt-24 py-12 md:py-16">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  <Leaf size={14} />
                  Picked for your table
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Find your fresh favorite
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Browse the harvest and fine-tune your picks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  aria-label="Refresh products"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-wait disabled:opacity-60"
                >
                  <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
                  <span>{isFetching ? "Refreshing" : "Refresh"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(open => !open)}
                  aria-expanded={filtersOpen}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800 md:hidden"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-slate-500 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-600/10">
                  <ArrowDownWideNarrow size={16} />
                  <span className="sr-only">Sort products</span>
                  <select
                    value={sortBy}
                    onChange={event => setSortBy(event.target.value)}
                    className="max-w-40 cursor-pointer bg-transparent text-sm font-medium text-slate-700 outline-none"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="top-rated">Top rated</option>
                    <option value="newest">Newest</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </label>
              </div>
            </div>

            <div
              className={`${filtersOpen ? 'block' : 'hidden'} md:block`}
            >
              <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                      <SlidersHorizontal size={17} />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
                      <p className="text-xs text-slate-500">Find exactly what you need</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-emerald-800"
                  >
                    <RotateCcw size={14} />
                    Clear all
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                  <label className="block 2xl:col-span-2">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">Search products</span>
                    <span className="relative block">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        value={localSearch}
                        onChange={event => setLocalSearch(event.target.value)}
                        placeholder="Try tomatoes or apples"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">Category</span>
                    <span className="relative block">
                      <select
                        value={category}
                        onChange={event => setCategory(event.target.value)}
                        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-9 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                      >
                        <option value="">All categories</option>
                        {categories.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Minimum price <span className="font-normal text-slate-400">({safeProducts[0]?.currency || 'BDT'})</span>
                    </span>
                    <input
                      type="number"
                      min="0"
                      max={priceCeiling}
                      value={minimumPrice}
                      onChange={event => setMinimumPrice(event.target.value)}
                      placeholder="Any"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>Maximum price</span>
                      <span className="font-medium text-emerald-800">
                        {safeProducts[0]?.currency || 'BDT'} {activeMaximumPrice.toLocaleString()}
                      </span>
                    </span>
                    <input
                      type="range"
                      min="1"
                      max={priceCeiling}
                      value={Math.min(activeMaximumPrice, priceCeiling)}
                      onChange={event => setMaximumPrice(Number(event.target.value))}
                      aria-label="Maximum price"
                      className="mt-2 h-3 w-full cursor-pointer accent-emerald-700"
                    />
                    <span className="mt-1 flex justify-between text-[10px] text-slate-400">
                      <span>{safeProducts[0]?.currency || 'BDT'} 1</span>
                      <span>{priceCeiling.toLocaleString()}</span>
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">Customer rating</span>
                    <span className="relative block">
                      <select
                        value={minimumRating}
                        onChange={event => setMinimumRating(Number(event.target.value))}
                        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-9 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                      >
                        <option value={0}>Any rating</option>
                        <option value={4}>4 stars & up</option>
                        <option value={3}>3 stars & up</option>
                        <option value={2}>2 stars & up</option>
                      </select>
                      <Star size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 fill-amber-400 text-amber-400" />
                    </span>
                  </label>

                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 transition hover:border-emerald-200 hover:bg-emerald-50/40">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={event => setInStockOnly(event.target.checked)}
                      className="checkbox checkbox-sm checkbox-success"
                    />
                    <span>
                      <span className="block text-xs font-semibold text-slate-700">In stock only</span>
                      <span className="mt-0.5 block text-[10px] text-slate-400">Ready to order</span>
                    </span>
                  </label>
                </div>

                {searchQuery && (
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                    <Search size={13} />
                    Search: <span className="font-semibold">{searchQuery}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {category ? `Showing ${category.toLowerCase()} picks` : 'Fresh finds selected for you'}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                <Sparkles size={14} className="text-emerald-700" />
                Thoughtfully sourced, freshly delivered
              </div>
            </div>

            {isError && (
              <p role="status" className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Showing the last loaded products. Refresh failed: {error?.message || "Please try again."}
              </p>
            )}

            {filteredProducts.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Search size={24} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {safeProducts.length === 0 ? "No products found" : "No products match those filters"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {safeProducts.length === 0
                    ? "The catalog is empty right now. Reload to check for new products."
                    : "Try a different search or clear some filters."}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  {safeProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      Clear filters
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
                  >
                    <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
                    {isFetching ? "Reloading data..." : "Reload products"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 py-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {currentProducts.map((product, index) => (
                  <Card
                    key={product._id || `${product.title}-${index}`}
                    product={product}
                  />
                ))}
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {firstVisibleProduct}–{lastVisibleProduct}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <label className="mr-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                    Per page
                    <select
                      aria-label="Products per page"
                      value={pageSize}
                      onChange={event =>
                        setPageSize(
                          event.target.value === "all"
                            ? "all"
                            : Number(event.target.value)
                        )
                      }
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-600/10"
                    >
                      <option value={12}>12</option>
                      <option value={20}>20</option>
                      <option value={40}>40</option>
                      <option value="all">All</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages).keys()].map(num => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => handlePageChange(num + 1)}
                      aria-current={currentPage === num + 1 ? "page" : undefined}
                      aria-label={`Page ${num + 1}`}
                      className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                        currentPage === num + 1
                          ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/15"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-800"
                      }`}
                    >
                      {num + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <ProductFeatureSection/>
    </section>
  )
};

export default Products;
