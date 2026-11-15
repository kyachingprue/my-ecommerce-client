import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const ContactNewsletter = () => {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 px-2 py-8 sm:gap-6 sm:px-4 sm:py-10 lg:grid-cols-2">
      {/* Call Us Section */}
      <div data-aos="fade-up" data-aos-duration="1000" className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-6 sm:p-6">
        <div className="shrink-0 rounded-full border-2 border-dotted border-emerald-500 p-3 sm:p-4">
          <FaPhoneAlt className="text-3xl text-emerald-700 sm:text-4xl" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-600">Call Us 24/7</p>
          <h3 className="break-words text-lg font-bold text-slate-900 sm:text-2xl">(1800)-88-66-991</h3>
          <p className="mt-1 break-words text-xs text-slate-600 sm:text-sm">contact@example.com</p>
        </div>
      </div>

      {/* Subscribe Section */}
      <div data-aos="fade-up" data-aos-duration="2000" className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-6 sm:p-6">
        <div className="shrink-0 rounded-full border-2 border-dotted border-emerald-500 p-3 sm:p-4">
          <HiOutlineMail className="text-3xl text-emerald-700 sm:text-4xl" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">Subscribe Newsletter</h3>
          <p className="mb-3 text-sm text-slate-600">
            Get E-mail updates latest shop & special offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full min-w-0 flex-1 rounded-none rounded-l-md focus:border-emerald-600 focus:outline-none sm:w-auto"
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
