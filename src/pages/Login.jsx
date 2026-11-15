import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useAuth from "../Hooks/useAuth";
import useTitle from "../Hooks/useTitle";
import SocialLogin from "./SocialLogin";

const Login = () => {
  useTitle("Sign in");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { userLogin, resetPassword, loading, setLoading } = useAuth();
  const isBusy = loading || isSubmitting;

  // Demo credentials are exposed in the browser bundle. Use only for local/demo
  // environments; remove this list before deploying to production.
  const demoAccounts = [
    {
      role: "User",
      email: "kyachingpruemarma5@gmail.com",
      password: "@Kyachingprue123",
      description: "Shop and manage your orders",
    },
    {
      role: "Seller",
      email: "kyachingmarma413@gmail.com",
      password: "123456",
      description: "Manage products and sales",
    },
    {
      role: "Admin",
      email: "kyachingpruemarma.info@gmail.com",
      password: "123456",
      description: "Manage the marketplace",
    },
  ];

  const selectDemoAccount = account => {
    setValue("email", account.email, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("password", account.password, {
      shouldValidate: true,
      shouldDirty: true,
    });
    toast.success(`${account.role} demo credentials filled in`);
  };

  const onSubmit = async data => {
    setLoading(true);
    try {
      await userLogin(data.email.trim(), data.password);
      navigate(from, { replace: true });
      toast.success("Successfully logged in");
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const validEmail = await trigger("email");
    if (!validEmail) return;
    setLoading(true);
    try {
      await resetPassword(getValues("email").trim());
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      toast.error(error.message || "Could not send the password reset email.");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10";
  return (
    <main className="relative isolate overflow-hidden bg-[#f3f7f1] px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 bottom-0 h-96 w-96 rounded-full bg-lime-200/40 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_90px_-40px_rgba(20,60,40,0.3)] lg:min-h-[680px] lg:grid-cols-[0.88fr_1.12fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#123b2d] px-10 py-11 text-white lg:flex xl:px-12">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-20 h-80 w-80 rounded-full border-[42px] border-white/[0.04]"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full border-[54px] border-white/[0.04]"
          />

          <div className="relative">

            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Leaf size={22} strokeWidth={2.2} />
              </span>
              <span className="text-xl font-bold tracking-tight">GreenBasket</span>
            </Link>

            <div className="mt-20">
             <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-medium text-emerald-100">
                <Sparkles size={14} aria-hidden="true" />
                Welcome back
              </span>
              <h1 className="mt-6 max-w-sm text-4xl font-semibold leading-[1.15] tracking-tight xl:text-[2.8rem]">
                Your fresh
                <br />
                favorites await.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-7 text-emerald-100/75">
                Sign in to pick up where you left off and make your next shop
                feel effortless.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-100/70">
                    Your local market
                  </p>
                  <p className="mt-1 text-sm font-semibold">Good food, ready to discover</p>
                </div>

                <div className="flex shrink-0 -space-x-2 text-2xl" aria-label="Fresh produce">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#174633] bg-[#f1f8e9]">🥑</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#174633] bg-[#fff3e0]">🍊</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#174633] bg-[#fce4ec]">🍎</span>
                </div>

              </div>

              <div className="mt-5 h-px bg-white/10" />
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100/80">
                <span className="h-2 w-2 rounded-full bg-lime-300" />
                A fresher way to shop
              </div>
            </div>
          </div>
          <div className="relative mt-12 space-y-3">
            {[
              "Your basket is just a few clicks away",
              "Simple, secure sign in",
              "Your profile, your preferences",
            ].map(benefit => (
              <div key={benefit} className="flex items-center gap-3 text-sm text-emerald-50/90">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200">
                  <Check size={13} strokeWidth={2.5} />
                </span>
                {benefit}
              </div>

            ))}
            <p className="pt-5 text-xs text-emerald-100/50">
              Better groceries. Better everyday.
            </p>
          </div>
        </aside>
        <section className="px-6 py-8 sm:px-10 sm:py-11 lg:px-12 xl:px-16">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-lg font-bold text-emerald-900 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <Leaf size={20} />
            </span>
            GreenBasket
          </Link>

          <div className="mx-auto max-w-md">
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Welcome back
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.15rem]">
                Sign in to GreenBasket
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your fresh favorites and orders are waiting for you.
              </p>
            </div>

            <SocialLogin />

            {/* Demo role shortcuts */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">
                  Quick demo login
                </p>
                <span className="text-xs text-slate-400">
                  Select a role to fill the form
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map(account => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => selectDemoAccount(account)}
                    disabled={isBusy}
                    className="group rounded-xl border border-emerald-100 bg-emerald-50/70 px-2 py-3 text-center transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-600/15 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Fill ${account.role} demo credentials`}
                  >
                    <span className="block text-sm font-bold text-emerald-900">
                      {account.role}
                    </span>
                    <span className="mt-1 block text-[10px] leading-4 text-emerald-700">
                      {account.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                or sign in with email
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "login-email-error" : undefined}
                    {...register("email", {
                      required: "Please enter your email address.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address.",
                      },
                    })}
                    className={inputClassName}
                  />
                </div>
                {errors.email && (
                  <p id="login-email-error" className="mt-1.5 text-xs text-rose-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={isBusy}
                    className="text-xs font-semibold text-emerald-800 decoration-emerald-300 underline-offset-4 transition hover:text-emerald-950 hover:underline disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "login-password-error" : undefined}
                    {...register("password", {
                      required: "Please enter your password.",
                      minLength: {
                        value: 6,
                        message: "Your password must be at least 6 characters.",
                      },
                    })}
                    className={`${inputClassName} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(visible => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
                </div>
                {errors.password && (
                  <p id="login-password-error" className="mt-1.5 text-xs text-rose-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isBusy}
                aria-busy={isBusy}
                className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
              >
                {isBusy ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              New to GreenBasket?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-800 decoration-emerald-300 underline-offset-4 transition hover:text-emerald-950 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
