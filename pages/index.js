import React, { useState, useRef, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/Products'; 
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Reviews from '../components/Reviews';
import Head from '../components/Head';
import ScrollingBanner from '../components/ScrollingBanner';
import Categories from '../components/Categories';
import SimulatorPopup from '../components/SimulatorPopup';
import Certifications from 'components/Certifications';

import { fetchData }  from '../lib/supabase.mjs'; // Assurez-vous que le chemin est correct
import { da } from 'date-fns/locale';

const Home = ({ data, shop, brand, products, categories, reviews }) => {
  const [cartCount, setCartCount] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(storedCart.length);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.66; // Réglez la vitesse (0.5 = 50% de la vitesse normale)
    }
  }, []);

  console.log('Shop logo:', shop.logo);

  return (
    <div className="container">
      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${shop.name} - ${data.heroTitle}`}
      /> 
      
      <main>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
        
        <section className="hero">
          <h1>{data.heroTitle}</h1>
          <p>{data.heroDesc}</p>
          <a href="/bestsellers"><button>Découvrir les bestsellers</button></a>
          <div className='filter'></div>
          <video ref={videoRef} autoPlay muted loop playsInline>
            <source src='https://bpybtzxqypswjiizkzja.supabase.co/storage/v1/object/public/ecom/christopeit-france/hero.webm' type='video/webm' />
          </video>
          {/* <img src={data.heroMedia} alt="Hero" /> */}
        </section>

        <ScrollingBanner items={data.saleBanner} />
        {/* <SimulatorPopup products={products} categories={categories}/> */}
        
        <section className="intro">
          <div className='wrapper'>
            <h2>{data.introTitle}</h2>
            <p>{data.introDesc}</p>
          </div>
        </section>

        <Categories categories={categories} data={data}/>
 
        <Products 
          title={shop.name + ' Bestsellers'} 
          products={products} 
          categories={categories}
          initialCategoryFilter="bestsellers" 
          data={data}
          shop={shop}
        />

        <Certifications/>
        
        <Testimonials data={data} shop={shop} reviews={reviews}/>
        
        <About data={data} shop={shop} />
        
        
      </main>

      <Footer shop={shop} data={data} />
    </div>
  );
};

export async function getStaticProps() {

  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });

  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID, show: true }, order: { order: 'desc' } });
  const reviews = await fetchData('reviews', { match: { shop_id: process.env.SHOP_ID } });
  const posts = await fetchData('posts', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      data: data[0],
      shop: shop[0],
      brand: brand[0],
      products: products,
      categories: categories,
      reviews: reviews,
      posts: posts,
    },
  };
}

export default Home;