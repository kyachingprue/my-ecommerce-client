import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { toast } from "react-hot-toast";
import SocialLogin from "./SocialLogin";
import axios from "axios";
import { useState } from "react";
import { Fan } from 'lucide-react';
import useAxiosInstance from "../Hooks/useAxiosInstance";


const Register = () => {
  const { createUser, profileUpdate, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const axiosInstance = useAxiosInstance()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // ✅ Handle Register form submit
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (!selectedFile) {
        toast.error("Please select a profile image!");
        return;
      }

      // 🔹 Upload to imgBB
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": undefined, // ✅ fix CORS issue
          },
        }
      );

      const imageUrl = res.data.data.display_url;
      // Final user data
      const profile = {
        displayName: data.name,
        photoURL: imageUrl,
      };

      // 2️⃣ Create user in Firebase
      await createUser(data.email, data.password);

      // Update user profile
      await profileUpdate(profile)

      // Update user Role
      const userInfo = {
        email: data.email,
        name: data.displayName,
        role: 'user',
        created_at: new Date().toISOString(),
        lasted_login: new Date().toISOString()
      }
      const userRole = await axiosInstance.post('/users', userInfo)
      console.log(userRole.data);
      navigate("/");
      toast.success(" Registration Successful!");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 When file selected from file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // show preview
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/7d9hHwY0/premium-photo-1669550788590-859353c91996.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg w-[450px] border border-white/30 text-white">
        <h2 className="text-3xl font-bold text-center mb-4">
          Create Your Account 🌱
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 🔹 Profile image preview */}
          <div className="flex flex-col items-center">
            <label htmlFor="profile-image" className="cursor-pointer">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400 text-gray-400">
                  📷
                </div>
              )}
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              placeholder="Create a password"
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

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full p-2 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-300 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Register Button */}

          <button className="w-full bg-green-500 hover:bg-green-600 mx-auto text-center transition-all py-2 rounded-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
            {
              loading ? <Fan className="text-3xl text-black animate-spin mx-auto" />
                :
                <p className='text-black font-bold'>Register</p>
            }
          </button>
        </form>

        <div className="divider text-gray-200 mt-3 mb-2">OR</div>
        <SocialLogin />

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green-300 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
