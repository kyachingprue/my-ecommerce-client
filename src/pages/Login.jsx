import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { Fan } from "lucide-react";
import SocialLogin from "./SocialLogin";
import toast from "react-hot-toast";
import useTitle from "../Hooks/useTitle";

const Login = () => {
  useTitle("Login-page")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/";
  const { userLogin, loading, setLoading } = useAuth()

  // ✅ handle login form submission
  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    // User login authentication in the firebase
    try {
      await userLogin(data.email, data.password);
      navigate(from, { replace: true });
      toast.success('Successfully Login');
      setLoading(false)
    } catch (error) {
      console.log(error.message);
      setLoading(false)
    }

  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/v46cbwC8/evx-AM7-G29-ED3-Rw-Unyrchjj.jpg')", // 🌿 background image
      }}
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 🔳 Glassmorphism login box */}
      <div className="relative z-10 bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96 border border-white/30 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back 🌿
        </h2>

        {/* React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full p-2 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full p-2 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition-all py-2 rounded-md font-semibold mt-4"
          >
            {
              loading ? <Fan className="text-3xl text-black animate-spin mx-auto" />
                :
                <p className='text-black font-bold'>Login</p>
            }
          </button>
        </form>
        <div className="divider">OR</div>
        <SocialLogin></SocialLogin>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-300 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
