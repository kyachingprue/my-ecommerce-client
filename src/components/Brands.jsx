import React from 'react';

const Brands = () => {
  return (
    <div>
      <h2 className='text-black text-xl font-bold'>Shop By Brands</h2>
      <div className='flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-center md:justify-between pt-5 pb-10'>
        <div
          data-aos="flip-up"
          data-aos-duration="1000"
          className="w-36 h-40 rounded-md border-2 relative border-gray-500"
          style={{
            backgroundImage:
              "url(https://i.ibb.co.com/Y4Kg4gvn/urban-garden-city-farm-logo-design-linear-style-illustration-vector.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          <p className='absolute bottom-2 left-8 uppercase text-black font-medium text-sm'>Brand #1</p>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="2000"
          className="w-36 h-40 rounded-md border-2 relative border-gray-500"
          style={{
            backgroundImage:
              "url(https://i.ibb.co.com/5XSrJhWY/black-organic-wheat-logo-icon-illustration-vector.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          <p className='absolute bottom-2 left-8 uppercase text-black font-medium text-sm'>Brand #2</p>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="3000"
          className="w-36 h-40 rounded-md border-2 relative border-gray-500"
          style={{
            backgroundImage:
              "url(https://i.ibb.co.com/rfyBT4Wz/images-3.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          <p className='absolute bottom-2 left-8 uppercase text-black font-medium text-sm'>Brand #3</p>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="4000"
          className="w-36 h-40 rounded-md border-2 relative border-gray-500"
          style={{
            backgroundImage:
              "url(https://i.ibb.co.com/1G0qzh1H/TIPCo-logo1.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          <p className='absolute bottom-2 left-8 uppercase text-black font-medium text-sm'>Brand #4</p>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="5000"
          className="w-36 h-40 rounded-md border-2 relative border-gray-500"
          style={{
            backgroundImage:
              "url(https://i.ibb.co.com/7xw83mDc/green-fresh-seeds-logo-design-natural-seed-logo-design-vector.jpg)",
            backgroundSize: "cover",    // ✅ replaces object-fit
            backgroundPosition: "center",
            overflow: "hidden",         // ✅ valid property
          }}
        >
          <p className='absolute bottom-2 left-8 uppercase text-black font-medium text-sm'>Brand #5</p>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="6000"
          className="w-36 h-40 rounded-md border-2 relative border-gray-500"
          style={{
            backgroundImage:
              "url(https://i.ibb.co.com/VpMgQzp4/800w-ws-DEEk-WYUHw.jpg)",
            backgroundSize: "cover",    // ✅ replaces object-fit
            backgroundPosition: "center",
            overflow: "hidden",         // ✅ valid property
          }}
        >
          <p className='absolute bottom-2 left-8 uppercase text-black font-medium text-sm'>Brand #6</p>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="7000"
          className="w-36 h-40 rounded-md border-2 relative border-gray-500"
          style={{
            backgroundImage:
              "url(https://i.ibb.co.com/kVvFR8nb/farm-fresh-icon-vector-illustration-260nw-2127342821.jpg)",
            backgroundSize: "cover",    // ✅ replaces object-fit
            backgroundPosition: "center",
            overflow: "hidden",         // ✅ valid property
          }}
        >
          <p className='absolute bottom-2 left-8 uppercase text-black font-medium text-sm'>Brand #7</p>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="8000"
          className="w-36 h-40 rounded-md border-2 relative border-gray-500"
          style={{
            backgroundImage:
              "url(https://i.ibb.co.com/YFmNjnPY/smart-agriculture-logo-icon-startup-260nw-1748526758.png)",
            backgroundSize: "cover",    // ✅ replaces object-fit
            backgroundPosition: "center",
            overflow: "hidden",         // ✅ valid property
          }}
        >
          <p className='absolute bottom-2 left-8 uppercase text-black font-medium text-sm'>Brand #8</p>
        </div>
      </div>
    </div>
  );
};

export default Brands;