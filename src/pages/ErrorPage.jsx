import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import useTitle from "../Hooks/useTitle";

const ErrorPage = () => {
  useTitle("Error-page")
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white text-center p-6">
      <h1 className="text-8xl font-extrabold text-green-400 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-all duration-300"
      >
        <FaArrowLeft /> Back to Home
      </Link>

      <div className="absolute bottom-6 text-sm text-gray-500">
        © {new Date().getFullYear()} GreenBasket Website K.M
      </div>
    </div>
  );
};

export default ErrorPage;
