import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroBanner = () => (
  <section
    data-aos="fade-up"
    data-aos-duration="800"
    className="relative my-8 flex min-h-[300px] items-center overflow-hidden rounded-[1.5rem] bg-slate-950 shadow-xl shadow-emerald-950/10 sm:my-12 sm:min-h-[380px] sm:rounded-[2rem]"
  >
    <img
      src="https://i.ibb.co.com/dwGvyH7x/fresh-colorful-vegetables-and-fruits-on-display.jpg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/10" />
    <div className="relative z-10 max-w-2xl px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
      <span className="rounded-full border border-emerald-200/30 bg-emerald-200/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-100">
        Picked with care
      </span>
      <h2 className="mt-5 text-3xl font-black uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
        Organic food,
        <span className="block text-emerald-300">better every day.</span>
      </h2>
      <p className="mt-4 max-w-lg text-sm leading-6 text-slate-200 sm:text-base">
        Explore fresh produce and everyday essentials from trusted local suppliers.
      </p>
      <Link
        to="/products"
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-white transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/30"
      >
        Explore products
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </div>
  </section>
);

export default HeroBanner;
