import { ArrowRight, HeartHandshake, Leaf, ShieldCheck, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import useTitle from "../Hooks/useTitle";
import AboutBanner from "../components/AboutBanner";

const values = [
  {
    icon: <Leaf size={21} aria-hidden="true" />,
    title: "Fresh by choice",
    description: "We help you discover fresh groceries for meals made at home.",
    color: "from-emerald-500 to-green-700",
  },
  {
    icon: <HeartHandshake size={21} aria-hidden="true" />,
    title: "Closer to local sellers",
    description: "A marketplace that brings shoppers and independent sellers together.",
    color: "from-teal-500 to-cyan-700",
  },
  {
    icon: <ShieldCheck size={21} aria-hidden="true" />,
    title: "Shopping with confidence",
    description: "A clear, easy-to-use experience from product discovery to checkout.",
    color: "from-lime-500 to-emerald-700",
  },
  {
    icon: <Sprout size={21} aria-hidden="true" />,
    title: "A greener mindset",
    description: "We celebrate thoughtful food choices and sustainable living.",
    color: "from-green-500 to-teal-700",
  },
];

const About = () => {
  useTitle("About");

  return (
    <main className="space-y-10 pb-10 sm:space-y-14 sm:pb-14">
      <AboutBanner />

      <div className="mx-auto max-w-[1500px] px-1 sm:px-2">
        <section
          id="our-mission"
          className="grid overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-lime-50 shadow-xl shadow-emerald-950/5 lg:grid-cols-2"
        >
          <div className="relative min-h-64 overflow-hidden bg-emerald-100 sm:min-h-80 lg:min-h-[440px]">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
              alt="Colorful fresh vegetables arranged for a meal"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-emerald-900/10" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-slate-950/35 p-4 text-white backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lime-200">
                GreenBasket, at a glance
              </p>
              <p className="mt-1 text-lg font-bold sm:text-xl">
                Good food starts with good choices.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              <Sprout size={14} aria-hidden="true" />
              Our mission
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              A simpler way to shop fresh.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              We connect customers with local sellers through an easy-to-use
              online marketplace. GreenBasket is built to make discovering
              everyday groceries straightforward, convenient, and welcoming.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4">
                <p className="font-semibold text-slate-900">For customers</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Browse products and find fresh picks in one place.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4">
                <p className="font-semibold text-slate-900">For local sellers</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Reach shoppers looking for quality everyday goods.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              What matters to us
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              The values behind your basket
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              A friendly shopping experience, grounded in freshness, community, and care.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(value => (
              <article
                key={value.title}
                className="group rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5 sm:p-6"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${value.color} text-white shadow-lg shadow-emerald-900/10 transition group-hover:scale-105`}>
                  {value.icon}
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-emerald-950 via-emerald-800 to-green-700 px-5 py-9 text-center text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-lime-300/15 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-sm font-medium text-emerald-100">Eat fresh. Live green.</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Find something fresh for your table.
            </h2>
            <Link
              to="/products"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-bold text-emerald-950 transition hover:bg-lime-200 focus:outline-none focus:ring-4 focus:ring-lime-100/30"
            >
              Shop products
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
