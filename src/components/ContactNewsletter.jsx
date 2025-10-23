import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const ContactNewsletter = () => {
  return (
    <div className="container mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Call Us Section */}
      <div className="flex items-center gap-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="border-2 border-dotted border-orange-500 rounded-full p-4">
          <FaPhoneAlt className="text-4xl text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Call Us 24/7</p>
          <h3 className="text-2xl font-bold text-gray-900">(1800)-88-66-991</h3>
          <p className="text-sm text-gray-700 mt-1">contact@example.com</p>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="flex items-center gap-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="border-2 border-dotted border-orange-500 rounded-full p-4">
          <HiOutlineMail className="text-4xl text-orange-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Subscribe Newsletter</h3>
          <p className="text-sm text-gray-600 mb-3">
            Get E-mail updates latest shop & special offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full sm:w-auto flex-1 rounded-none rounded-l-md focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="btn btn-ghost text-black font-semibold border-b-2 border-black rounded-none hover:text-orange-500 hover:border-orange-500 transition"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactNewsletter;
