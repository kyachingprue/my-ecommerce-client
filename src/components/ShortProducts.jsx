import React, { useEffect, useState } from 'react';
import Card from './Card';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const ShortProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('https://green-basket-blond.vercel.app/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false);
      })
  }, [])
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>
  }
  return (
    <div>
      <h3 className='text-3xl font-bold text-black py-5'>Total Products {products.length}</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 py-10'>
        {
          products.slice(0, 20).map((product) => <Card key={product.id} product={product}></Card>)
        }
      </div>
      <Link to='/products' className='justify-center items-center flex'>
        <button className='py-3 px-6 rounded-2xl hover:bg-cyan-600 bg-cyan-500 shadow-lg shadow-cyan-500/50 mb-10 text-xl text-black font-medium'>See more products</button>
      </Link>
    </div>
  );
};

export default ShortProducts;