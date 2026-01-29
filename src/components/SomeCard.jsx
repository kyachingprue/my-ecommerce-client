import React from 'react';

const SomeCard = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center md:justify-between md:my-10 mx-6 md:mx-2">
      {/* Card 1 */}
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        className="w-[330px] md:w-[430px] mb-4 md:mb-0 h-64 relative"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/qLc1yT5B/BSC-Healthy-Plate-1200x628-Revised-1200x610.jpg')",
          borderRadius: "6px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <h2 className='text-blue-100 bg-gray-800 py-2 px-5 rounded-md text-xl font-bold absolute top-4 left-4'>Health Products</h2>
        <div className='absolute bottom-5 left-5'>
          <button className='btn btn-accent text-black font-bold'>Order now</button>
        </div>
      </div>

      {/* Card 2 */}
      <div data-aos="fade-up"
        data-aos-duration="2000"
        className="w-[330px] md:w-[430px] mb-4 md:mb-0 h-64 relative"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/Gfxbdgjt/Journey-from-Farm-to-Table-How-Fresh-Organic-Foods-Delivers-Quality1-1000x565.jpg')",
          borderRadius: "6px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <h2 className='text-black bg-blue-200 py-2 px-5 rounded-md text-xl font-bold absolute top-4 left-4'>Fresh Organic Foods</h2>
        <div className='absolute bottom-5 left-5'>
          <button className='btn btn-accent text-black font-bold'>Order now</button>
        </div>
      </div>

      {/* Card 3 */}
      <div
        data-aos="fade-up"
        data-aos-duration="3000"
        className="w-[330px] md:w-[430px] mb-7 md:mb-0 h-64 relative"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/wr3cx7SJ/20240314121138650.jpg')",
          borderRadius: "6px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <h2 className='text-black bg-orange-100 py-2 px-5 rounded-md text-xl font-bold absolute top-4 left-4'>Vegetables</h2>
        <div className='absolute bottom-5 left-5'>
          <button className='btn btn-accent text-black font-bold'>Order now</button>
        </div>
      </div>
    </div>
  );
};

export default SomeCard;
