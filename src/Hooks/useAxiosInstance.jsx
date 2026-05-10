import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
  baseURL: `https://green-basket-serverweb.vercel.app`
})
const useAxiosInstance = () => {
  return axiosInstance;
};

export default useAxiosInstance;
