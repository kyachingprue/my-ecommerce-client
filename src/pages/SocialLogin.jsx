import { FcGoogle } from "react-icons/fc";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import useAxiosInstance from "../Hooks/useAxiosInstance";

const SocialLogin = () => {
  const { googleLogin, profileUpdate } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxiosInstance();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Capture returned user info
      const result = await googleLogin();
      const user = result.user; // user info from Google

      // Optional: update user profile (usually not needed for Google login)
      await profileUpdate({
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      // Prepare user data for backend
      const userInfo = {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        role: "user",
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      // ✅ Save user in DB
      const userRes = await axiosInstance.post("/users", userInfo);
      console.log("User saved:", userRes.data);

      toast.success(`Welcome ${user.displayName}! 🎉`);
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`flex items-center justify-center gap-2 w-full py-2 bg-white text-gray-800 font-semibold rounded-md shadow hover:shadow-lg transition-all ${loading
          ? "cursor-not-allowed opacity-50 hover:bg-white hover:shadow"
          : "hover:bg-gray-100"
          }`}
      >
        {loading ? (
          <span className="animate-spin border-2 border-gray-300 border-t-gray-800 rounded-full w-5 h-5"></span>
        ) : (
          <FcGoogle className="text-2xl" />
        )}
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
    </div>
  );
};

export default SocialLogin;
