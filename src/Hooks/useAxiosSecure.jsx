import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? 'http://localhost:5173'
      : 'https://green-basket-serverweb.vercel.app',

  withCredentials: true
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // cleanup interceptor when component unmounts
    return () => axiosSecure.interceptors.request.eject(interceptor);
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;
