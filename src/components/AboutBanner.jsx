import { motion as Motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FaLeaf, FaTruck, FaUsers } from "react-icons/fa";

const highlights = [
  {
    icon: <FaLeaf aria-hidden="true" />,
    title: "Thoughtful selection",
    description: "Everyday groceries chosen with care.",
  },
  {
    icon: <FaTruck aria-hidden="true" />,
    title: "Convenient delivery",
    description: "Order fresh essentials from home.",
  },
  {
    icon: <FaUsers aria-hidden="true" />,
    title: "A local marketplace",
    description: "Connecting shoppers with local sellers.",
  },
];

const AboutBanner = () => (
  <section className="relative isolate overflow-hidden rounded-[1.5rem] bg-[#052e1b] px-4 py-12 text-white shadow-2xl shadow-emerald-950/15 sm:rounded-[2rem] sm:px-8 sm:py-16 lg:px-14 lg:py-20">
    <img
      src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop"
      alt=""
      aria-hidden="true"
      fetchPriority="high"
      className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#052e1b]/95 via-emerald-950/90 to-emerald-800/75" />
    <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl sm:h-96 sm:w-96" />
    <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl sm:h-96 sm:w-96" />

    <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      <div>
        <Motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur"
        >
          <FaLeaf aria-hidden="true" />
          About GreenBasket
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
        >
          Good food,
          <span className="block bg-gradient-to-r from-lime-200 via-emerald-200 to-teal-100 bg-clip-text text-transparent">
            a greener way to shop.
          </span>
        </Motion.h1>

        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-5 max-w-2xl text-sm leading-7 text-emerald-50/80 sm:text-base"
        >
          GreenBasket brings fresh groceries and trusted local sellers together
          in one simple marketplace. We make it easier to find quality food for
          your everyday table.
        </Motion.p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-bold text-emerald-950 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-lime-200 focus:outline-none focus:ring-4 focus:ring-lime-200/30"
          >
            Explore products
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <a
            href="#our-mission"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Our mission
          </a>
        </div>

        <div className="mt-9 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-4">
          {[
            ["50K+", "Happy customers"],
            ["1K+", "Organic products"],
            ["24/7", "Online shopping"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur sm:p-4"
            >
              <p className="text-xl font-extrabold text-lime-200 sm:text-2xl">{value}</p>
              <p className="mt-1 text-[10px] leading-4 text-emerald-50/70 sm:text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <Motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto w-full max-w-xl rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/15 backdrop-blur-xl sm:p-7"
      >
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200">
            Our promise
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Shopping that feels closer to home.
          </h2>
        </div>
        <div className="space-y-4">
          {highlights.map(item => (
            <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/15 p-3 sm:gap-4 sm:p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lime-200/20 to-emerald-300/20 text-lg text-lime-200">
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-white">{item.title}</span>
                <span className="mt-1 block text-sm leading-5 text-emerald-50/70">{item.description}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-emerald-50/70">
          <span className="h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_16px_rgba(190,242,100,0.8)]" />
          A thoughtful way to fill your basket.
        </div>
      </Motion.div>
    </div>
  </section>
);

export default AboutBanner;
