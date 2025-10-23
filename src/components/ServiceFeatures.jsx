import { FaShippingFast, FaDollarSign, FaHeadset, FaCreditCard } from "react-icons/fa";

const ServiceFeatures = () => {
  const features = [
    {
      icon: <FaShippingFast className="text-3xl text-orange-500" />,
      title: "Free Shipping",
      description: "Free Shipping On All US",
    },
    {
      icon: <FaDollarSign className="text-3xl text-orange-500" />,
      title: "Money Returns",
      description: "Return It Within 30 Days",
    },
    {
      icon: <FaCreditCard className="text-3xl text-orange-500" />,
      title: "Security Payment",
      description: "We Ensure Secure Payment",
    },
    {
      icon: <FaHeadset className="text-3xl text-orange-500" />,
      title: "Support 24/7",
      description: "Contact Us 24 Hours A Day",
    },
  ];

  return (
    <div className="bg-orange-50 rounded-2xl py-8 px-4 mb-10 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 shadow-sm">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-center gap-4 text-center md:text-left"
        >
          <div>{feature.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceFeatures;
