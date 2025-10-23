import React from "react";
import { FaLeaf, FaUsers, FaStore, FaTruck } from "react-icons/fa";
import useTitle from "../Hooks/useTitle";

const About = () => {
  useTitle('About-')
  return (
    <div className=" bg-blue-100 dark:bg-gray-600 text-gray-800 dark:text-white py-12 px-6 md:px-16">
      {/* 🌿 Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-black mb-4">
          About Our Vegetable Store
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          We are dedicated to bringing you the freshest, healthiest vegetables
          directly from local organic farms. Our mission is to support
          sustainable agriculture while providing customers with high-quality,
          eco-friendly produce.
        </p>
      </div>

      {/* 💚 Mission Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-black">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We connect farmers, sellers, and customers through an easy-to-use
            online marketplace. Our platform ensures fair trade, promotes
            eco-friendly packaging, and encourages people to eat healthy and
            live sustainably.
          </p>
        </div>

        <img
          src="https://i.ibb.co.com/XZr2Xc9V/643188-gettyimages-153946385-ca1ccfaad9be44325afc434b305adc0d.png"
          alt="Organic Vegetables"
          className="rounded-2xl shadow-lg w-full object-cover"
        />
      </div>

      {/* 📊 Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-14 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <FaLeaf className="text-green-500 text-3xl mx-auto mb-2" />
          <h3 className="text-2xl font-bold">150+</h3>
          <p className="text-gray-500 dark:text-gray-400">Fresh Products</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <FaStore className="text-green-500 text-3xl mx-auto mb-2" />
          <h3 className="text-2xl font-bold">35+</h3>
          <p className="text-gray-500 dark:text-gray-400">Local Sellers</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <FaUsers className="text-green-500 text-3xl mx-auto mb-2" />
          <h3 className="text-2xl font-bold">1200+</h3>
          <p className="text-gray-500 dark:text-gray-400">Happy Customers</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <FaTruck className="text-green-500 text-3xl mx-auto mb-2" />
          <h3 className="text-2xl font-bold">Fast</h3>
          <p className="text-gray-500 dark:text-gray-400">Delivery Service</p>
        </div>
      </div>

      {/* 🌱 Footer Message */}
      <div className="text-center mt-16">
        <h3 className="text-xl font-semibold text-black mb-2">
          “Eat Fresh, Live Green 🌿”
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Thank you for being part of our eco-friendly journey!
        </p>
      </div>
    </div>
  );
};

export default About;
