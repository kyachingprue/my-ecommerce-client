import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  Clock3,
  Leaf,
  LoaderCircle,
  PackageCheck,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useRole from "../../../Hooks/useRole";

const SellerRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { role } = useRole();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestAlreadyExists, setRequestAlreadyExists] = useState(false);

  const handleSellerRequest = async event => {
    event.preventDefault();
    if (!user?.email) {
      toast.error("Please sign in again before submitting your request.");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        email: user.email,
        name: user.displayName || "",
        message: message.trim(),
        status: "pending",
        requested_at: new Date().toISOString(),
      };

      const response = await axiosSecure.post("/seller-requests", requestData);
      if (response.data.success) {
        setRequestSubmitted(true);
        setRequestAlreadyExists(false);
        setMessage("");
        toast.success("Your seller request has been submitted.");
      } else {
        setRequestAlreadyExists(true);
        toast.error(response.data.message || "A seller request already exists.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not submit your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (role === "seller") {
    return (
      <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-xl shadow-emerald-950/5 sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <BadgeCheck size={30} />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            You’re already a GreenBasket seller
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            Your seller account is ready. Head to your workspace to manage products and orders.
          </p>
          <Link
            to="/dashboard/seller/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Open seller workspace <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  if (requestSubmitted || requestAlreadyExists) {
    return (
      <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/5">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-700 p-6 text-center text-white sm:p-10">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              {requestSubmitted ? <CircleCheck size={30} /> : <Clock3 size={30} />}
            </span>
            <h2 className="mt-5 text-2xl font-bold">
              {requestSubmitted ? "Your request is on its way" : "Request already on file"}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-emerald-50/80">
              {requestSubmitted
                ? "Thanks for your interest in selling with GreenBasket. Our team will review your application."
                : "A seller request has already been submitted for this account. Our team will review it and update your account when there is a decision."}
            </p>
          </div>
          <div className="p-5 sm:p-8">
            <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <Clock3 size={19} className="mt-0.5 shrink-0 text-amber-700" />
              <div>
                <p className="text-sm font-bold text-amber-950">Review in progress</p>
                <p className="mt-1 text-sm leading-5 text-amber-900/75">
                  You can continue shopping while your application is being reviewed.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Back to storefront <ArrowRight size={16} />
              </Link>
              <Link
                to="/dashboard/profile"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View my profile <UserRound size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-700 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <Leaf size={14} />
              Grow with GreenBasket
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Become a seller
            </h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50/80 sm:text-base">
              Bring your products to a community that values fresh, thoughtful shopping.
              Tell us a little about your business to get started.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white">
            <ShieldCheck size={18} />
            Seller application
          </span>
        </div>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <form
          onSubmit={handleSellerRequest}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Your application</h3>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Your account details help our team follow up about your request.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Full name
              <input
                type="text"
                value={user?.displayName || ""}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 font-normal text-slate-500"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 font-normal text-slate-500"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Tell us about your business
            <textarea
              value={message}
              onChange={event => setMessage(event.target.value)}
              rows={6}
              minLength={10}
              maxLength={1500}
              required
              placeholder="What products would you like to sell? Tell us about your experience and what makes your products special."
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-normal leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
            <span className="mt-1 block text-right text-xs font-normal text-slate-400">
              {message.length}/1500
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Submitting request...
              </>
            ) : (
              <>
                <Store size={18} />
                Submit seller request
              </>
            )}
          </button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
              <PackageCheck size={21} />
            </span>
            <h3 className="mt-4 font-bold text-slate-900">What happens next?</h3>
            <ol className="mt-4 space-y-4">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                  1
                </span>
                <span className="text-sm leading-5 text-slate-600">
                  Submit your business details for review.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                  2
                </span>
                <span className="text-sm leading-5 text-slate-600">
                  Our team reviews your application.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                  3
                </span>
                <span className="text-sm leading-5 text-slate-600">
                  If approved, your seller workspace will be ready.
                </span>
              </li>
            </ol>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
                <Store size={19} />
              </span>
              <div>
                <h3 className="font-bold text-emerald-950">Ready to grow?</h3>
                <p className="mt-1 text-sm leading-5 text-emerald-900/70">
                  Share quality products and build lasting customer relationships.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default SellerRequest;
