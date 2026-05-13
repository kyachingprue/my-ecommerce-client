import React from 'react'
import { motion } from 'motion/react'
import { FaLeaf, FaTruck, FaUsers } from 'react-icons/fa'

const AboutBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-xl bg-[#052e1b] text-white py-24 px-4 md:px-10 lg:px-16">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1524594157369-7d8b9c0d1a7d?q=80&w=1600&auto=format&fit=crop"
        alt="about background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#052e1b] via-[#064e3b]/90 to-[#052e1b]" />

      {/* Floating Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-500/20 blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-400/20 text-green-300 text-sm"
          >
            <FaLeaf />
            About GreenBasket
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-black leading-tight mt-6"
          >
            We Deliver
            <span className="block text-green-400">Fresh Organic Life</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mt-6 leading-relaxed text-sm md:text-lg max-w-xl"
          >
            GreenBasket is a modern e-commerce platform dedicated to providing
            fresh, organic, and healthy groceries directly from trusted farmers.
            We focus on quality, sustainability, and fast delivery to improve
            your everyday lifestyle.
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              ['50K+', 'Happy Customers'],
              ['1K+', 'Organic Products'],
              ['24/7', 'Fast Delivery']
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-xl"
              >
                <h3 className="text-2xl font-bold text-green-400">{item[0]}</h3>
                <p className="text-xs text-gray-400 mt-1">{item[1]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT - 3D CARDS */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Main Card */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="w-full max-w-md rounded-[35px] bg-white/5 border border-white/10 backdrop-blur-2xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Why Choose Us?
            </h2>

            {/* Feature 1 */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                <FaLeaf />
              </div>
              <div>
                <h3 className="font-semibold">100% Organic</h3>
                <p className="text-sm text-gray-400">
                  Fresh products directly from farms.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <FaTruck />
              </div>
              <div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-gray-400">
                  Get groceries delivered within hours.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <FaUsers />
              </div>
              <div>
                <h3 className="font-semibold">Trusted by Thousands</h3>
                <p className="text-sm text-gray-400">
                  Loved by customers across the country.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating Glow Ball */}
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-green-400/20 blur-3xl rounded-full"
          />
        </div>
      </div>
    </section>
  )
}

export default AboutBanner
