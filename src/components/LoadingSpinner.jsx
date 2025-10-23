import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-green-500 border-solid"></div>
    </div>
  );
};

export default LoadingSpinner;
