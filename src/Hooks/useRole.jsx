import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";


const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: roleData = {},
    isLoading: roleLoading,
    isError,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  return { role: roleData.role || "user", roleLoading, isError };
};

export default useRole;
