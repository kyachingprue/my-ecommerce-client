import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const banners = [
  {
    id: 1,
    title: "Fresh Garden Products",
    price: 24.25,
    desc: "Freshly squeezed juices from our organic fruits delivered to your door",
    img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce", // tomato image
  },
  {
    id: 2,
    title: "Organic Vegetables",
    price: 19.99,
    desc: "Pure, pesticide-free vegetables direct from our local farms.",
    img: "https://images.unsplash.com/photo-1582515073490-39981397c445", // onion image
  },
  {
    id: 3,
    title: "Healthy Farm Fresh",
    price: 15.75,
    desc: "Eat fresh, stay healthy — nature’s best delivered to you.",
    img: "https://i.ibb.co.com/QjdwKzmk/healthful-vegetables-Getty-Images-1251268295-Header-1024x575.jpg", // pepper image
  },
  {
    id: 4,
    title: "Fresh vegetables",
    price: 17.34,
    desc: "Eat fresh, stay healthy — nature’s best delivered to you.",
    img: "https://i.ibb.co.com/wFFxnTY8/broccoli-green-background-829282730.jpg", // pepper image
  },
];

const Banner = () => {
  return (
    <div className="relative rounded-md overflow-hidden mb-5 h-[500px]">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="mySwiper"
      >
        {banners.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 bg-gray-900 text-white"
              style={{
                backgroundImage: `url(${item.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "500px",
              }}
            >
              <div data-aos="fade-up" className="bg-black bg-opacity-50 mt-20 md:mt-0 py-7 px-6 w-10/12 md:w-6/12 rounded-xl">
                <h2 className="text-sm md:text-4xl font-bold mb-2">
                  {item.title}
                </h2>
                <p className="text-red-400 font-semibold text-xl md:text-lg mb-1">
                  FROM <span className="text-red-500 text-3xl">${item.price}</span>
                </p>
                <p className="text-gray-200 mb-5">{item.desc}</p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-3 md:px-5 py-1 md:py-2 rounded-full text-sm md:mb-0 md:ml-0 font-medium transition">
                  Check Products →
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation buttons */}
        <div className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 p-2 rounded-full shadow-md cursor-pointer">
          <FaArrowLeft size={18} color="white" />
        </div>
        <div className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 p-2 rounded-full shadow-md cursor-pointer">
          <FaArrowRight size={18} color="white" />
        </div>
      </Swiper>
    </div>
  );
};

export default Banner;
