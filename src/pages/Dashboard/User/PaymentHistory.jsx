import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/LoadingSpinner';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ['payments', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/${user.email}`)
      return res.data.data;
    }
  })

  if (isPending) {
    return <LoadingSpinner></LoadingSpinner>
  }

  return (
    <div className="overflow-x-auto bg-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>

      <table className="table w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th>#</th>
            <th>Product Title</th>
            <th>Amount</th>
            <th>ProductId</th>
            <th>User Email</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.length > 0 ? (
            payments.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.amount} TK</td>
                <td>{item.productId}</td>
                <td>{item.user_email}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white ${item.status === "succeeded"
                      ? "bg-green-500"
                      : "bg-red-500"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  {new Date(item.createdAt_string).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No payment history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;