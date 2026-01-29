import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
  baseURL: `https://green-basket-blond.vercel.app`,
})
const useAxiosInstance = () => {
  return axiosInstance;
};

export default useAxiosInstance;