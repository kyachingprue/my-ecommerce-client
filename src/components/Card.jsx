import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';

const Card = ({ product }) => {
  const { title, image, category, price, seller, currency, rating } = product;
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to ProductDetails and send product data via state
    navigate(`/products/${product._id}`, { state: { product } });
  };
  return (
    <div
      data-aos="fade-up"
      data-aos-duration="1000"
      className='w-64 rounded-md mx-auto border border-gray-300 p-2' onClick={handleClick}>
      <div >
        <img className='w-full h-44 object-cover rounded-md' src={image} alt="" />
      </div>
      <div>
        <h2 className='text-xl font-medium text-black py-3'>{title}</h2>
        <div className='flex justify-between items-center'>
          <p className='py-1 px-5 rounded-full bg-blue-200 text-black text-center'>{category}</p>
          <div className='flex bg-green-200 text-black py-1 px-5 rounded-full items-center'>
            <p className='text-sm flex items-center gap-1'>Price: {price}</p>
            <p className='text-sm'>{currency}</p>
          </div>
        </div>
        <p className='text-sm text-black font-bold pt-2'>Seller Email:-</p>
        <p className='text-sm text-gray-600 pb-2'>{seller.email}</p>
        <div>
          <StarRating rating={rating} />
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <button className='btn btn-accent text-black my-3'>Add To Cart</button>
        <button className='btn btn-info text-black my-3 '>View Details</button>
      </div>
    </div>
  );
};

export default Card;