import React from "react";

const HeroBanner = () => {
  return (
    <div>
      <div
        className="hero h-96 rounded-md relative my-10"
        style={{
          backgroundImage:
            "url(https://i.ibb.co.com/dwGvyH7x/fresh-colorful-vegetables-and-fruits-on-display.jpg)",
        }}
      >
        <div className="absolute top-10 left-12">
          <h2 className="text-7xl font-bold uppercase text-black py-2">organic <br />
            foods</h2>
          <button className="btn btn-info text-xl my-3 font-bold px-10">Get Sale</button>
          <p className="text-sm py-3 text-gray-700">Online Purchases Only</p>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
