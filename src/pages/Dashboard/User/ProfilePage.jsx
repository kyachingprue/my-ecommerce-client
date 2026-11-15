import { createElement, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Camera,
  Check,
  FileText,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const emptyProfile = {
  name: "",
  profileImage: "",
  phone: "",
  address: "",
  bio: "",
};

const getProfileValues = (userData = {}, user = {}) => ({
  name: userData.name || user.displayName || "",
  profileImage: userData.profileImage || userData.photo || user.photoURL || "",
  phone: userData.phone || "",
  address: userData.address || "",
  bio: userData.bio || "",
});

const DetailCard = ({ icon, label, value, className = "" }) => (
  <div className={`rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 ${className}`}>
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
      {createElement(icon, {
        size: 16,
        className: "text-emerald-700",
        "aria-hidden": true,
      })}
      {label}
    </div>
    <p className="whitespace-pre-line break-words text-sm font-semibold text-slate-800 sm:text-base">
      {value || <span className="font-normal italic text-slate-400">Not provided</span>}
    </p>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    data: userData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${encodeURIComponent(user.email)}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    setProfile(
      getProfileValues(userData, {
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      })
    );
  }, [userData, user?.displayName, user?.photoURL]);

  const handleChange = event => {
    const { name, value } = event.target;
    setProfile(current => ({ ...current, [name]: value }));
  };

  const handleProfileImageClick = () => {
    if (!editing) setEditing(true);
    fileInputRef.current?.click();
  };

  const handleImageUpload = async event => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file to upload.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Choose an image smaller than 8 MB.");
      return;
    }

    const apiKey = import.meta.env.VITE_IMAGE_API_KEY;
    if (!apiKey) {
      toast.error("Image upload is not configured. Set VITE_IMAGE_API_KEY.");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
        { method: "POST", body: formData }
      );
      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.error?.message || "The image could not be uploaded.");
      }

      setProfile(current => ({ ...current, profileImage: result.data.url }));
      toast.success("Photo uploaded. Save your changes to apply it to your profile.");
    } catch (error) {
      toast.error(error.message || "Could not upload your photo. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    setProfile(getProfileValues(userData, user));
    setEditing(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await axiosSecure.patch(
        `/users/${encodeURIComponent(user.email)}`,
        profile
      );
      const updatedUser = response.data.user;
      setProfile(getProfileValues(updatedUser, user));
      queryClient.setQueryData(["userData", user.email], updatedUser);
      await queryClient.invalidateQueries({ queryKey: ["userRole", user.email] });
      setEditing(false);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center text-rose-700">
        Failed to load profile data. Please refresh and try again.
      </div>
    );
  }

  const displayProfile = getProfileValues(userData, user);
  const initials = (displayProfile.name || user?.email || "U")
    .trim()
    .slice(0, 1)
    .toUpperCase();
  const createdDate = userData.created_at ? new Date(userData.created_at) : null;
  const joinedDate =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <section className="min-h-screen rounded-2xl bg-slate-50 p-3 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
        <header className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-700 p-5 text-white sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-6">
              <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                  tabIndex={-1}
                  aria-label="Choose a profile photo from your computer"
                />
                <button
                  type="button"
                  onClick={handleProfileImageClick}
                  disabled={uploadingImage}
                  aria-label="Choose a profile photo from your computer"
                  title="Choose a profile photo"
                  className="group relative h-full w-full rounded-full outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 disabled:cursor-wait"
                >
                  <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-lime-100 to-emerald-200 text-2xl font-bold text-emerald-950 ring-4 ring-white/80 transition group-hover:brightness-95 sm:text-3xl">
                    {initials}
                    {profile.profileImage && (
                      <img
                        src={profile.profileImage}
                        alt=""
                        onError={event => {
                          event.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 h-full w-full rounded-full object-cover"
                      />
                    )}
                  </span>
                  <span className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-900 bg-white text-emerald-800 shadow-md transition group-hover:scale-105 group-hover:bg-emerald-50">
                    {uploadingImage ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Camera size={17} />
                    )}
                  </span>
                </button>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                  Your account
                </p>
                <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">
                  {displayProfile.name || "Your profile"}
                </h1>
                <p className="mt-1 break-all text-sm text-emerald-50/85">{user?.email}</p>
                {editing && (
                  <p className="mt-2 text-xs text-emerald-100/80">
                    {uploadingImage
                      ? "Uploading photo..."
                      : "Select the camera to choose a photo from your device."}
                  </p>
                )}
              </div>
            </div>

            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
              >
                <Pencil size={16} />
                Edit profile
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving || uploadingImage}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <X size={16} />
                Cancel editing
              </button>
            )}
          </div>
        </header>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8 lg:p-10">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Edit your details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Update your information, then save to apply your changes.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Full name
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Email address
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 font-normal text-slate-500"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Phone
                <input
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  maxLength={40}
                  placeholder="Add your phone number"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Address
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  maxLength={500}
                  rows={3}
                  placeholder="Add your delivery address"
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              About you
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                placeholder="Share a little information about yourself"
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold capitalize text-emerald-800">
                <ShieldCheck size={16} />
                {userData.role || "user"} account
              </span>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Saving profile...
                  </>
                ) : (
                  <>
                    <Check size={17} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Personal information</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your profile details are shown here.
                </p>
              </div>
              <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-800 sm:mt-0">
                <ShieldCheck size={15} />
                {userData.role || "user"} account
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <DetailCard icon={UserRound} label="Full name" value={displayProfile.name} />
              <DetailCard icon={Mail} label="Email address" value={user?.email} />
              <DetailCard icon={Phone} label="Phone" value={displayProfile.phone} />
              <DetailCard icon={MapPin} label="Address" value={displayProfile.address} />
              {joinedDate && (
                <DetailCard icon={CalendarDays} label="Member since" value={joinedDate} />
              )}
              <DetailCard
                icon={FileText}
                label="About you"
                value={displayProfile.bio}
                className="sm:col-span-2"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
