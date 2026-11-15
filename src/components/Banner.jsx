import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const banners = [
  {
    id: 1,
    title: "Fresh Garden Products",
    price: 24.25,
    desc: "Freshly picked produce and organic favorites, delivered to your door.",
    img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
  },
  {
    id: 2,
    title: "Organic Vegetables",
    price: 19.99,
    desc: "Thoughtfully sourced vegetables from trusted local farms.",
    img: "https://images.unsplash.com/photo-1582515073490-39981397c445",
  },
  {
    id: 3,
    title: "Healthy, Farm Fresh",
    price: 15.75,
    desc: "Make every meal brighter with nature’s freshest picks.",
    img: "https://i.ibb.co.com/QjdwKzmk/healthful-vegetables-Getty-Images-1251268295-Header-1024x575.jpg",
  },
  {
    id: 4,
    title: "Good Food, Grown with Care",
    price: 18.5,
    desc: "Everyday groceries selected for freshness and quality.",
    img: "https://i.ibb.co.com/wFFxnTY8/broccoli-green-background-829282730.jpg",
  },
];

const Banner = () => (
  <section className="relative mb-8 overflow-hidden rounded-[1.5rem] shadow-xl shadow-emerald-950/10 sm:mb-12 sm:rounded-[2rem]">
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation={{
        nextEl: ".home-banner-next",
        prevEl: ".home-banner-prev",
      }}
      autoplay={{ delay: 4500, disableOnInteraction: false }}
      loop
      className="home-banner"
    >
      {banners.map(item => (
        <SwiperSlide key={item.id}>
          <div className="relative flex min-h-[430px] items-center overflow-hidden bg-slate-950 sm:min-h-[500px] lg:min-h-[560px]">
            <img
              src={item.img}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07140d]/95 via-[#07140d]/75 to-[#07140d]/25" />
            <div className="relative z-10 w-full px-5 py-12 sm:px-10 lg:px-16">
              <div className="max-w-2xl rounded-[1.5rem] border border-white/15 bg-slate-950/35 p-5 shadow-2xl backdrop-blur-md sm:p-8 lg:p-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-100 sm:text-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Fresh from trusted local farms
                </span>
                <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                  {item.title}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">
                  {item.desc}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <p className="text-sm text-slate-300">
                    From{" "}
                    <span className="ml-1 text-2xl font-extrabold text-white sm:text-3xl">
                      ${item.price.toFixed(2)}
                    </span>
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/30"
                  >
                    Shop fresh picks
                    <FaArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}

      <button
        type="button"
        aria-label="Previous promotion"
        className="home-banner-prev absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/50 text-white shadow-lg backdrop-blur transition hover:bg-emerald-700 sm:flex sm:left-5"
      >
        <FaArrowLeft size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Next promotion"
        className="home-banner-next absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/50 text-white shadow-lg backdrop-blur transition hover:bg-emerald-700 sm:flex sm:right-5"
      >
        <FaArrowRight size={16} aria-hidden="true" />
      </button>
    </Swiper>
  </section>
);

export default Banner;
