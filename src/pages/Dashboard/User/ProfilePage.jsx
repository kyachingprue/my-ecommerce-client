import React from "react";
import {
  FaUser,
  FaShoppingCart,
  FaMoneyBillWave,
  FaBox,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";


const ProfilePage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch user data from MongoDB using TanStack Query
  const {
    data: userData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email, // ✅ Only run if email exists
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p className="text-center text-red-500">Failed to load profile data.</p>;

  // ✅ Merge Firebase + MongoDB Data
  const profile = {
    name: user.displayName || "Unknown User",
    email: user.email || "kyachingprue.info@gmail.com",
    photo: user.photoURL || "https://via.placeholder.com/150",
    role: userData?.role || "user",
  };

  return (
    <div className="min-h-screen bg-gray-900 rounded-md text-white">
      {/* Cover Image */}
      <div className="relative h-72 w-full bg-gray-700">
        <img
          src="https://i.ibb.co.com/kgrK7TPT/ab-abraham-lake-rocky-mountains-alberta.jpg"
          alt="Cover"
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {/* Profile Image */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
          <img
            src={profile.photo}
            alt="Profile"
            loading="lazy"
            className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="text-center mt-16">
        <div className="flex items-center justify-center gap-1">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-blue-200 text-xl font-semibold">
            ({profile.role})
          </p>
        </div>
        <p className="text-gray-300 mt-1">email: {profile.email}</p>
      </div>

      {/* 3D Animation Card */}
      <div className="flex flex-col md:flex-row justify-around items-center gap-4">
        {/* 1st card */}
        <a href="#" className="hover-3d my-12 mx-2 cursor-pointer">
          {/* content */}
          <div className="card w-96 bg-black text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]">
            <div className="card-body">
              <div className="flex justify-between mb-10">
                <div className="font-bold">BANK OF LATVERIA</div>
                <div className="text-5xl opacity-10">❁</div>
              </div>
              <div className="text-lg mb-4 opacity-40">0210 8820 1150 0222</div>
              <div className="flex justify-between">
                <div>
                  <div className="text-xs opacity-20">CARD HOLDER</div>
                  <div>VICTOR VON D.</div>
                </div>
                <div>
                  <div className="text-xs opacity-20">EXPIRES</div>
                  <div>29/08</div>
                </div>
              </div>
            </div>
          </div>

          {/* 8 empty divs needed for the 3D effect */}
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </a>
        {/* 2nd Card */}
        <div className="hover-3d">
          {/* content */}
          <figure className="max-w-100 rounded-2xl">
            <img
              src="https://img.daisyui.com/images/stock/creditcard.webp"
              alt="3D card"
            />
          </figure>
          {/* 8 empty divs needed for the 3D effect */}
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
};

// ✅ Card Component
const Card = ({ icon, value, label, color }) => (
  <div className={`${color} p-4 rounded-xl shadow-lg flex flex-col items-center`}>
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="font-bold">{value || 0}</h3>
    <p>{label}</p>
  </div>
);

export default ProfilePage;
