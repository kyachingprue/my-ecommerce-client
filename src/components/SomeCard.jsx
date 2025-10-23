import React from 'react';

const SomeCard = () => {
  return (
    <div className="flex items-center justify-between my-7 gap-4">
      {/* Card 1 */}
      <div
        className="w-[430px] h-64 relative"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/qLc1yT5B/BSC-Healthy-Plate-1200x628-Revised-1200x610.jpg')",
          borderRadius: "6px",        // ✅ use camelCase
          backgroundSize: "cover",    // ✅ replaces object-fit
          backgroundPosition: "center",
          overflow: "hidden",         // ✅ valid property
        }}
      >
        <h2 className='text-blue-100 bg-gray-800 py-2 px-5 rounded-md text-xl font-bold absolute top-4 left-4'>Health Products</h2>
        <div className='absolute bottom-5 left-5'>
          <button className='btn btn-accent text-black font-bold'>Order now</button>
        </div>
      </div>

      {/* Card 2 */}
      <div
        className="w-[430px] h-64 relative"
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
        className="w-[430px] h-64 relative"
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
