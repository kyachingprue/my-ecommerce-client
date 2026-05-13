import React from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaApple,
  FaGooglePlay,
  FaLeaf,
  FaArrowRight
} from 'react-icons/fa'
import { motion } from 'framer-motion'

const footerLinks = {
  Shop: [
    'Fresh Vegetables',
    'Organic Fruits',
    'Dairy & Eggs',
    'Seafood',
    'Bakery'
  ],
  Company: ['About Us', 'Careers', 'Our Farmers', 'Blog', 'Press Media'],
  Support: [
    'Contact Us',
    'Track Order',
    'Shipping Info',
    'Return Policy',
    'Help Center'
  ]
}

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#07140d] rounded-3xl text-white mt-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-500/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-400/10 blur-[120px]" />

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                <FaLeaf className="text-white text-2xl" />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-wide">
                  GreenBasket
                </h1>
                <p className="text-sm text-green-300">Smart Organic Grocery</p>
              </div>
            </div>

            <p className="text-gray-400 mt-6 leading-relaxed max-w-md">
              Transforming grocery shopping with eco-friendly delivery,
              AI-powered recommendations, and premium organic products directly
              from local farmers.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                ['50K+', 'Customers'],
                ['120+', 'Farmers'],
                ['99%', 'Fresh Rate']
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl"
                >
                  <h3 className="text-2xl font-bold text-green-400">
                    {item[0]}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{item[1]}</p>
                </div>
              ))}
            </div>

            {/* App Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-green-400/30 hover:bg-green-500/10 transition-all duration-300">
                <FaApple className="text-2xl" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Download on the</p>
                  <h5 className="font-semibold">App Store</h5>
                </div>
              </button>

              <button className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-green-400/30 hover:bg-green-500/10 transition-all duration-300">
                <FaGooglePlay className="text-2xl" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Get it on</p>
                  <h5 className="font-semibold">Google Play</h5>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Dynamic Links */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-6 text-white">{title}</h3>

              <ul className="space-y-4">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="/"
                      className="group flex items-center gap-2 text-gray-400 hover:text-green-400 transition-all duration-300"
                    >
                      <span className="w-0 group-hover:w-3 h-[2px] bg-green-400 transition-all duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Copyright */}
          <p className="text-gray-500 text-sm text-center lg:text-left">
            © 2026 GreenBasket. All rights reserved. Designed for modern
            eco-commerce experiences.
          </p>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, index) => (
                <motion.a
                  key={index}
                  href="/"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 hover:border-green-400 transition-all duration-300"
                >
                  <Icon />
                </motion.a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
