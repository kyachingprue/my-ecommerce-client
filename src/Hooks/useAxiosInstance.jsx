import axios from 'axios';
import React from 'react';
const axiosInstance = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? 'http://localhost:4000'
      : 'https://green-basket-serverweb.vercel.app'
})
const useAxiosInstance = () => {
  return axiosInstance;
};

export default useAxiosInstance;
