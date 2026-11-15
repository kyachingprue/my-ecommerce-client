import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import useAuth from '../../../Hooks/useAuth';
import LoadingSpinner from '../../../components/LoadingSpinner';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id: productId } = useParams();

  const { isPending, data: productInfo = {} } = useQuery({
    queryKey: ['products', productId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${productId}`)
      return res.data;
    }
  })

  if (isPending) {
    return <LoadingSpinner></LoadingSpinner>
  }
  const amount = productInfo.price;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement)
    if (!card) {
      return;
    }
    setIsSubmitting(true);
    try {
      const { error: paymentMethodError } = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        return;
      }

      setError('');
      const response = await axiosSecure.post("/create-payment-intent", {
        productId: productInfo._id,
        orderId: location.state?.orderId,
        userEmail: user?.email,
      });

      const result = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || "Customer",
            email: user?.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        toast.error(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === "succeeded") {
        await axiosSecure.post("/payments", {
          paymentIntentId: result.paymentIntent.id,
        });
        setSuccess("Payment successful!");
        toast.success("Payment successful!");
        navigate('/dashboard/payment-history');
      }
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Could not complete the payment.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-base-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-base-300 shadow-xl rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 transition-all duration-300"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          💳 Secure Payment
        </h2>

        <div className="mb-6 p-3 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 dark:bg-base-200 hover:border-green-500 transition-all duration-200">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || isSubmitting}
          className="w-full py-3 mt-2 font-semibold text-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing payment..." : `Pay Now 💰${amount} BDT`}
        </button>

        {error && <p className='text-red-600 pt-2 text-center'>{error}</p>}
        {success && <p className="text-green-600 text-center pt-3">{success}</p>}

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
          All transactions are securely encrypted 🔒
        </p>
      </form>
    </div>

  );
};

export default PaymentForm;