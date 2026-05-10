import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
  baseURL: `https://green-basket-serverweb.vercel.app || http://localhost:5173`
})
const useAxiosInstance = () => {
  return axiosInstance;
};

export default useAxiosInstance;
