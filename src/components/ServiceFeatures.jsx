import { FaShippingFast, FaLeaf, FaHeadset, FaCreditCard } from "react-icons/fa";

const ServiceFeatures = () => {
  const features = [
    {
      icon: <FaShippingFast className="text-2xl text-emerald-800" />,
      title: "Convenient delivery",
      description: "Get your groceries delivered to your door.",
    },
    {
      icon: <FaLeaf className="text-2xl text-emerald-800" />,
      title: "Fresh picks",
      description: "Quality groceries selected with care.",
    },
    {
      icon: <FaCreditCard className="text-2xl text-emerald-800" />,
      title: "Secure checkout",
      description: "A secure payment experience for your order.",
    },
    {
      icon: <FaHeadset className="text-2xl text-emerald-800" />,
      title: "Customer support",
      description: "We’re here to help with your shopping journey.",
    },
  ];

  return (
    <section className="mb-10 grid grid-cols-1 gap-3 rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-4 shadow-sm sm:grid-cols-2 sm:gap-4 sm:p-6 lg:grid-cols-4 lg:rounded-[2rem] lg:px-8">
      {features.map((feature, index) => (
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          key={index}
          className="flex items-center gap-4 rounded-2xl bg-white/70 p-4 text-left"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
            {feature.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 sm:text-base">{feature.title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">{feature.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ServiceFeatures;
