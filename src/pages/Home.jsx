import React from 'react';
import Banner from '../components/Banner';
import SomeCard from '../components/SomeCard';
import Brands from '../components/Brands';
import ShortProducts from '../components/ShortProducts';
import HeroBanner from '../components/HeroBanner';
import ServiceFeatures from '../components/ServiceFeatures';
import ContactNewsletter from '../components/ContactNewsletter';
import useTitle from '../Hooks/useTitle';

const Home = () => {
  useTitle("home -")
  return (
    <div>
      <Banner></Banner>
      <SomeCard></SomeCard>
      <Brands></Brands>
      <ShortProducts></ShortProducts>
      <HeroBanner></HeroBanner>
      <ServiceFeatures></ServiceFeatures>
      <ContactNewsletter></ContactNewsletter>
    </div>
  );
};

export default Home;