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

      const userInfo = {
        email: user.email,
        name: user.displayName || user.email.split("@")[0],
        profileImage: user.photoURL || "",
      };

      await axiosInstance.post("/users", userInfo);

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
    <div>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
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
