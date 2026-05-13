import React from 'react'
import { motion } from 'motion/react'
import {
  FaLeaf,
  FaShippingFast,
  FaAppleAlt,
  FaArrowRight
} from 'react-icons/fa'
import { MdVerified } from 'react-icons/md'

const features = [
  {
    id: 1,
    title: 'Fresh Organic Products',
    desc: 'Farm-fresh vegetables, fruits, dairy and organic groceries delivered daily.',
    icon: <FaLeaf />
  },
  {
    id: 2,
    title: 'Fast Delivery',
    desc: 'Get your groceries delivered within hours with real-time order tracking.',
    icon: <FaShippingFast />
  },
  {
    id: 3,
    title: 'Premium Quality',
    desc: 'All products are carefully selected from trusted local farmers and suppliers.',
    icon: <MdVerified />
  }
]

const HomeBottomCTA = () => {
  return (
    <section className="relative overflow-hidden px-4 md:px-8 lg:px-12 rounded-md py-20 bg-[#07140d]">
      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-green-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-500/10 blur-[130px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl"
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-6 md:p-10 lg:p-16">
            {/* LEFT CONTENT */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-green-400/20 bg-green-500/10 text-green-300 text-sm font-medium mb-6">
                <FaAppleAlt />
                Smart Organic Grocery Platform
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight text-white">
                Healthy Shopping
                <span className="block text-green-400">Made Smarter</span>
              </h1>

              {/* Description */}
              <p className="mt-6 text-gray-300 leading-relaxed text-sm sm:text-base max-w-xl">
                GreenBasket helps modern families discover premium organic
                groceries with lightning-fast delivery, AI-powered
                recommendations, and eco-friendly shopping experiences.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group h-14 px-7 rounded-2xl bg-green-500 hover:bg-green-400 transition-all duration-300 font-semibold text-white flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                >
                  Start Shopping
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>

                <button className="h-14 px-7 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-white font-medium">
                  Explore Categories
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                {[
                  ['25K+', 'Happy Users'],
                  ['500+', 'Organic Products'],
                  ['99%', 'Fresh Guarantee']
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 text-center"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-green-400">
                      {item[0]}
                    </h2>

                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                      {item[1]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Main Image */}
              <div className="relative rounded-[35px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1400&auto=format&fit=crop"
                  alt="Organic Grocery"
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                />

                {/* Floating Card */}
                <motion.div
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity
                  }}
                  className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-[#07140d]/80 backdrop-blur-2xl p-5"
                >
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-sm text-gray-400">
                        Today’s Special Offer
                      </p>

                      <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        Fresh Vegetables Pack
                      </h3>

                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-2xl font-black text-green-400">
                          $24
                        </span>

                        <span className="text-sm line-through text-gray-500">
                          $39
                        </span>
                      </div>
                    </div>

                    <button className="h-12 px-5 rounded-2xl bg-green-500 hover:bg-green-400 transition-all duration-300 text-white font-semibold">
                      Buy Now
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Floating Feature Card */}
              <motion.div
                animate={{
                  y: [0, 12, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity
                }}
                className="hidden md:block absolute -left-10 top-10 w-64 rounded-3xl border border-white/10 bg-[#0d1d14]/90 backdrop-blur-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 text-2xl">
                    <FaLeaf />
                  </div>

                  <div>
                    <h4 className="font-bold text-white">100% Organic</h4>

                    <p className="text-sm text-gray-400">
                      Eco-friendly products
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl p-7 hover:border-green-400/20 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-400 text-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                {feature.icon}
              </div>

              <h2 className="text-2xl font-bold text-white mt-6">
                {feature.title}
              </h2>

              <p className="text-gray-400 mt-4 leading-relaxed">
                {feature.desc}
              </p>

              <button className="mt-6 flex items-center gap-2 text-green-400 font-semibold group-hover:gap-3 transition-all duration-300">
                Learn More
                <FaArrowRight />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeBottomCTA
