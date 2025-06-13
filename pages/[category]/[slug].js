import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import Head from '../../components/Head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Products from '../../components/Products';
import Reviews from '../../components/Reviews';
import Categories from '../../components/Categories'; 
import Testimonials from '../../components/Testimonials';
import ScrollingBanner from '../../components/ScrollingBanner';
import ProductImages from '../../components/ProductImages';

import ProductInfos from '../../components/ProductInfos';

import {fetchData} from '../../lib/supabase.mjs'; // Assurez-vous que le chemin est correct

export default function ProductDetail({ product, category, shop, brand, data, products, categories, relatedProducts, otherCategories, reviews}) {
  const [cartCount, setCartCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [buttonText, setButtonText] = useState('Ajouter au panier');
  const sliderRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(() => {
    return 7 * 3600 + 37 * 60 + 20;
  });
  const [showBanner, setShowBanner] = useState(false);

  // Google Ads Event "Ajouter au panier" conversion page
function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };

  // Vérifier si gtag est disponible
  if (typeof gtag !== 'undefined' && shop?.tag && shop?.tagCart) {
    //console.log('Envoi événement Google Ads Add to Cart:', `${shop.tag}/${shop.tagCart}`);
    
    // Anthony : Réfécence Halt
    gtag('event', 'conversion', {
      'send_to': `${shop.tag}/${shop.tagCart}`,
      'event_callback': callback
    });
  } else {
    console.log('gtag non disponible pour Add to Cart ou paramètres shop manquants');
  }

  return false;
}

  useEffect(() => { 
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        sessionStorage.setItem('timeLeft', JSON.stringify(newTime));
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 1.2) {
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    }; 

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const getCurrentMonth = () => {
    return format(new Date(), 'MMMM', { locale: fr }).toUpperCase();
  };

  if (!product) { 
    return <div>Produit ou site non trouvé</div>;
  }

  const handleAddToCart = async (selectedOptionIndex = 0) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Récupérer les options du produit si elles existent
    const getProductOptions = (optionsJson) => {
      if (!optionsJson) return [];
      if (Array.isArray(optionsJson)) return optionsJson;
      try {
        return JSON.parse(optionsJson);
      } catch {
        return [];
      }
    };
    
    const productOptions = getProductOptions(product.options);
    const selectedOption = productOptions[selectedOptionIndex] || null;
    
    // Créer un objet produit avec l'option sélectionnée
    const productWithOption = {
      ...product,
      selectedOption: selectedOption,
      uniqueKey: `${product.id}_${selectedOptionIndex}` // Clé unique pour différencier les options
    };
    
    const productIndex = cart.findIndex(item => 
      item.id === product.id && 
      item.uniqueKey === productWithOption.uniqueKey
    );

    if (productIndex !== -1) {
      // Si le produit avec cette option est déjà dans le panier, augmenter la quantité
      cart[productIndex].quantity += 1;
    } else {
      // Sinon, ajouter le produit avec l'option sélectionnée
      const productWithQuantity = { ...productWithOption, quantity: 1 };
      cart.push(productWithQuantity);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Changer le texte du bouton
    setButtonText('Produit ajouté');
    setTimeout(() => setButtonText('Ajouter au panier'), 3000);
    
    // Ouvrir le drawer du panier
    document.querySelector('.cart-container').click();

    // Google Ads conversion tracking
    gtag_report_conversion();

    //console.log(cart);
  };

  // Fonction pour changer l'image principale quand une option est sélectionnée
  const handleOptionImageChange = (optionImageUrl) => {
    // Cette fonction peut maintenant être simplifiée car le composant ProductImages gère l'état
    console.log('Option image changed:', optionImageUrl);
  };

  function handleBuyNow() {
    handleAddToCart();
    window.location.href = '/checkout';
  }

  // Tracking "Page Vue" (Google Tag Manager)
  useEffect(() => {
    // Vérifier si gtag est disponible
    if (typeof gtag !== 'undefined' && shop?.tag && shop?.tagView) {
      //console.log('Envoi événement Google Ads Page View:', `${shop.tag}/${shop.tagView}`);
      
      // Anthony : Réfécence Halt - Google Ads
      gtag('event', 'conversion', {'send_to': `${shop.tag}/${shop.tagView}`});
    } else {
      console.log('gtag non disponible ou paramètres shop manquants:', {
        gtagAvailable: typeof gtag !== 'undefined',
        shopTag: shop?.tag,
        shopTagView: shop?.tagView
      });
    }
  }, [shop]);

  const images = product.images || [];

  return (
    <div className="container">

      <Head name={shop.name} domain={shop.domain} tag={shop.tag} pixel={shop.pixel} hotjar={shop.hotjar} 
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${product.title} - ${shop.name}`}
            description={product.description}
      />
      
      <main className={`product-page ${shop.id === 3 && 'wedinery'}`}>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
        <ScrollingBanner items={data.saleBanner} />
        
        <section className="product-hero">
        <div className="product-columns">
          <ProductImages 
            images={images}
            productTitle={product.title}
            variant="default"
            onImageChange={null}
          />
          <ProductInfos 
            data={data} 
            product={product} 
            handleAddToCart={handleAddToCart} 
            buttonText={buttonText} 
            shop={shop}
            onOptionChange={handleOptionImageChange}
          />
        </div>
      </section>

        <Reviews reviews={reviews} product={product.id}/>
  
        <section className="product-details">
          {product.advantages && (<div className={`wrapper advantages bg-main ${shop.id !== 2 && 'full'}`}><article dangerouslySetInnerHTML={{ __html: product.advantages }}/></div>)}
          {product.more1 && (<div className="wrapper more" dangerouslySetInnerHTML={{ __html: product.more1 }}/>)}
          {product.more2 && (<div className="wrapper more" dangerouslySetInnerHTML={{ __html: product.more2 }}/>)}
          {product.more3 && (<div className="wrapper more" dangerouslySetInnerHTML={{ __html: product.more3 }}/>)}
        </section>
  
        <Products
          categories={categories}
          products={relatedProducts}
          title={`Produits similaires`}
          showCategoryFilter={false}
          data={data}
          shop={shop}
        />

        <Testimonials data={data} shop={shop} reviews={reviews} />

        <Categories title='Autres catégories' categories={otherCategories} data={data} products={products}/>
        
      </main>
      {showBanner && (
        <section className='cta-banner-container'>
          <div className="cta-banner">
            <div className="banner-content">
                <h3>{product.title}</h3>
                <p className="description">{product.desc
                  .replace(/<a[\s\S]*?<\/a>/gi, '') // remove <a> tags and their content
                  .replace(/<li>/g, '')
                  .replace(/<\/li>/g, ' ⋅')
                  .replace(/<\/il>/g, '')
                  .replace(/<ul>/g, '')
                  .replace(/<\/ul>/g, '') 
                  .replace(/<strong>/g, '')
                  .replace(/<\/strong>/g, '')
                  .replace(/<b>/g, '')
                  .replace(/<\/b>/g, '')
                  .replace(/<br>/g, ', ')
                  .replace(/, /g, ' ')
                }</p>
                {product.discounted ? (
                  <>
                    <p className="price new color-primary">
                      {product.price.toFixed(2).replace('.', ',')} {shop.currency}
                      <span className="initial-price">{product.discounted.toFixed(2).replace('.', ',')} {shop.currency}</span>
                    </p>
                  </>
                ) : (
                  <p className="price">{product.price.toFixed(2).replace('.', ',')} {shop.currency}</p>
                )}
            </div>
            <article>
              <span>PROMO {getCurrentMonth()} 10%</span>
              <button onClick={handleBuyNow}>{data.productBuyFor} {(product.price * 0.90).toFixed(2).replace('.', ',')}{shop.currency}</button>
            </article>
        </div>
      </section>
      )}
      <Footer shop={shop} data={data} />
    </div>
  );
}

export async function getStaticPaths() {
  // Récupération des catégories et produits depuis Supabase
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID, show: true }, order: { id: 'desc' } });
  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });

  // Vérification que les données sont valides
  if (!categories || !products || categories.length === 0 || products.length === 0) {
    console.error("Erreur : catégories ou produits manquants dans les données récupérées.");
    return { paths: [], fallback: false };
  }

  // Création d'un dictionnaire pour accéder rapidement aux slugs des catégories par leur ID
  const categorySlugMap = categories.reduce((map, category) => {
    map[category.id] = category.slug;
    return map;
  }, {});

  // Génération des chemins à partir des slugs des catégories et produits
  const paths = products.map(product => {
    const categorySlug = categorySlugMap[product.category_id]; // Récupération du slug de la catégorie via category_id
    if (!categorySlug) {
      console.warn(`Aucun slug trouvé pour la catégorie avec ID ${product.category_id}`);
      return null; // Ignorer les produits sans catégorie correspondante
    }
    return { 
      params: {
        category: categorySlug,
        slug: product.slug,
      },
    };
  }).filter(Boolean); // Supprimer les chemins null ou indéfinis 

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { category: categorySlug, slug } = params;

  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });

  // Récupération des catégories et produits depuis Supabase
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID, show: true }, order: { id: 'desc' } });
  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });
  const reviews = await fetchData('reviews', { match: { shop_id: process.env.SHOP_ID } });


  // Trouver la catégorie correspondant au slug 
  const category = categories.find(cat => cat.slug === categorySlug);

  if (!category) {
    return {
      notFound: true,
    }; 
  }

  // Trouver le produit correspondant au slug et à la catégorie
  const product = products.find(p => p.slug === slug && p.category_id === category.id);

  if (!product) { 
    return {
      notFound: true,
    };
  } 

  // Produits associés (même catégorie, exclure le produit actuel)
  const relatedProducts = products.filter(
    p => p.category_id === product.category_id && p.slug !== slug
  );

  // Autres catégories (exclure la catégorie actuelle)
  const otherCategories = categories.filter(
    cat => cat.id !== category.id
  );

  return {
    props: {
      product,
      category, // Passez l'objet complet de la catégorie
      products,
      relatedProducts,
      otherCategories,
      categories,
      shop: shop[0],
      brand: brand[0],
      data: data[0],
      reviews: reviews,
    },
  };
}