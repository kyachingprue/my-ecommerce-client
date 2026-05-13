import React from 'react'
import { motion } from 'motion/react'
import { FaLeaf, FaShippingFast, FaShieldAlt, FaTags } from 'react-icons/fa'

const features = [
  {
    id: 1,
    title: '100% Organic Products',
    desc: 'Fresh vegetables and fruits directly from trusted farmers.',
    icon: <FaLeaf />,
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 2,
    title: 'Fast Home Delivery',
    desc: 'Get your groceries delivered within hours anywhere.',
    icon: <FaShippingFast />,
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 3,
    title: 'Secure Shopping',
    desc: 'Safe payment system with full data protection.',
    icon: <FaShieldAlt />,
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 4,
    title: 'Best Deals & Offers',
    desc: 'Daily discounts and seasonal offers on all products.',
    icon: <FaTags />,
    color: 'from-yellow-400 to-orange-500'
  }
]

const ProductFeatureSection = () => {
  return (
    <section className=" py-20 px-4 md:px-10 lg:px-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
          Why Choose <span className="text-green-500">GreenBasket</span>
        </h2>

        <p className="text-gray-500 mt-4 text-sm md:text-lg">
          We bring you fresh, organic, and high-quality groceries with modern
          technology and fast delivery system.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              rotateX: 8,
              rotateY: -8
            }}
            
          >
            <div className="relative p-6 rounded-3xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
              {/* Glow Background */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl bg-green-100" />

              {/* Icon */}
              <div
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl bg-gradient-to-r ${item.color} shadow-md`}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mt-5">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                {item.desc}
              </p>

              {/* Button */}
              <button className="mt-5 text-green-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                Learn More →
              </button>

              {/* 3D Shine Effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 bg-gradient-to-tr from-white via-transparent to-white" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ProductFeatureSection
