import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const stars = [];

  // loop 5 times for 5 stars
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400" />); // full star
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />); // half star
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />); // empty star
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

export default StarRating;
