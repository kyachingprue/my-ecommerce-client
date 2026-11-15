const brands = [
  "https://i.ibb.co.com/Y4Kg4gvn/urban-garden-city-farm-logo-design-linear-style-illustration-vector.jpg",
  "https://i.ibb.co.com/5XSrJhWY/black-organic-wheat-logo-icon-illustration-vector.jpg",
  "https://i.ibb.co.com/rfyBT4Wz/images-3.png",
  "https://i.ibb.co.com/1G0qzh1H/TIPCo-logo1.jpg",
  "https://i.ibb.co.com/7xw83mDc/green-fresh-seeds-logo-design-natural-seed-logo-design-vector.jpg",
  "https://i.ibb.co.com/VpMgQzp4/800w-ws-DEEk-WYUHw.jpg",
  "https://i.ibb.co.com/kVvFR8nb/farm-fresh-icon-vector-illustration-260nw-2127342821.jpg",
  "https://i.ibb.co.com/YFmNjnPY/smart-agriculture-logo-icon-startup-260nw-1748526758.png",
];

const Brands = () => (
  <section className="mx-auto max-w-[1500px] py-8 sm:py-12">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Trusted suppliers</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Shop by brand
        </h2>
      </div>
      <p className="max-w-sm text-sm text-slate-500">
        Discover growers and makers selected for quality and freshness.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 xl:grid-cols-8">
      {brands.map((image, index) => (
        <div
          key={image}
          className="group relative flex h-32 items-end overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:h-36"
        >
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
          <p className="relative text-xs font-bold uppercase tracking-wide text-white">
            Brand #{index + 1}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default Brands;
