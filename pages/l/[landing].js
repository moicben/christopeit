import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import Head from '../../components/Head';
import Footer from '../../components/Footer';
import Reviews from '../../components/Reviews';
import ProductImages from '../../components/ProductImages';
import Testimonials from '../../components/Testimonials';
import ProductInfos from '../../components/ProductInfos';
import ReviewsBadge from '../../components/ReviewsBadge';

import {fetchData} from '../../lib/supabase.mjs';

export default function Landing({ product, shop, brand, data, reviews }) {
  const [cartCount, setCartCount] = useState(0);
  const [buttonText, setButtonText] = useState('COMMANDER MAINTENANT (-50%)');
  const [timeLeft, setTimeLeft] = useState(() => {
    return 7 * 3600 + 37 * 60 + 20;
  });

  // Initialiser le compteur de panier au chargement
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
  }, []);

  // Google Ads Event "Ajouter au panier" conversion page
  function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };

    if (typeof gtag !== 'undefined' && shop?.tag && shop?.tagCart) {
      gtag('event', 'conversion', {
        'send_to': `${shop.tag}/${shop.tagCart}`,
        'event_callback': callback
      });
    }
    return false;
  }

  // Timer countdown
  useEffect(() => { 
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleAddToCart = async (selectedOptionIndex = 0) => {
    try {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
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
      
      const productWithOption = {
        ...product,
        selectedOption: selectedOption,
        uniqueKey: `${product.id}_${selectedOptionIndex}`
      };
      
      const productIndex = cart.findIndex(item => 
        item.id === product.id && 
        item.uniqueKey === productWithOption.uniqueKey
      );

      if (productIndex !== -1) {
        cart[productIndex].quantity += 1;
      } else {
        const productWithQuantity = { ...productWithOption, quantity: 1 };
        cart.push(productWithQuantity);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Mettre à jour le compteur de panier
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));

      setButtonText('✅ PRODUIT AJOUTÉ !');
      setTimeout(() => setButtonText('COMMANDER MAINTENANT (-50%)'), 2000);
      
      // Redirection directe vers checkout
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 1000);

      gtag_report_conversion();
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setButtonText('❌ ERREUR - RÉESSAYER');
      setTimeout(() => setButtonText('COMMANDER MAINTENANT (-50%)'), 3000);
    }
  };

  // Tracking Page Vue
  useEffect(() => {
    if (typeof gtag !== 'undefined' && shop?.tag && shop?.tagView) {
      gtag('event', 'conversion', {'send_to': `${shop.tag}/${shop.tagView}`});
    }
  }, [shop]);

  if (!product) { 
    return <div>Produit non trouvé</div>;
  }

  const images = product.images || [];

  return (
    <>
      <Head 
        name={shop.name} 
        domain={shop.domain} 
        tag={shop.tag} 
        pixel={shop.pixel} 
        hotjar={shop.hotjar} 
        favicon={brand.favicon} 
        graph={brand.graph}
        colorPrimary={brand.colorPrimary} 
        colorSecondary={brand.colorSecondary} 
        colorBlack={brand.colorBlack} 
        colorGrey={brand.colorGrey} 
        bgMain={brand.bgMain} 
        bgLight={brand.bgLight} 
        bgDark={brand.bgDark} 
        radiusBig={brand.radiusBig} 
        radiusMedium={brand.radiusMedium} 
        font={brand.font} 
        title={`${product.title} - PROMO FLASH -50% - ${shop.name}`}
        description={`${product.title} en promotion exceptionnelle. Livraison gratuite 48h. Satisfait ou remboursé 90 jours.`}
      />
      
      <div className="landing-container product-page">
        {/* Header Ultra-Simplifié */}
        <header className="landing-header">
          <div className="header-content">
            <img src={brand.logo} alt={shop.name} className="logo" />
            <div 
              className="cart-icon" 
              onClick={() => cartCount > 0 && (window.location.href = '/checkout')}
              style={{ cursor: cartCount > 0 ? 'pointer' : 'default' }}
            >
              🛒 <span className="cart-count">{cartCount}</span>
            </div>
          </div>
        </header>

        {/* Bannière USP Statique */}
        <section className="usp-banner bg-primary">
          <div className="usp-items">
            <div className="usp-item">📦 Livraison 48h</div>
            <div className="usp-item">✅ Satisfait ou Remboursé</div>
            <div className="usp-item flash">🔥 -50% Aujourd'hui</div>
          </div>
        </section>

        {/* Section Produit Principal */}
        <section className="product-hero-landing">
          
          {/* Images Produit */}
          <ProductImages
            images={images}
            productTitle={product.title}
            variant="default"
            onImageChange={null}
          />

          {/* Informations Produit */}
          <div className="product-info-landing">
            
            {/* Badge TOP VENTE */}
            <div className="top-badge">🏆 TOP VENTE</div>
            
            {/* Titre */}
            <h1 className="product-title-landing">{product.title}</h1>
            
            {/* Prix FLASH */}
            <div className="price-section-landing">
              <div className="flash-offer">⚡ OFFRE FLASH -50%</div>
              <div className="price-container">
                {product.discounted && product.discounted > product.price ? (
                  <>
                    <span className="old-price">{product.discounted.toFixed(2).replace('.', ',')} {shop.currency}</span>
                    <span className="new-price">{product.price.toFixed(2).replace('.', ',')} {shop.currency}</span>
                  </>
                ) : (
                  <>
                    <span className="old-price">{(product.price * 2).toFixed(2).replace('.', ',')} {shop.currency}</span>
                    <span className="new-price">{product.price.toFixed(2).replace('.', ',')} {shop.currency}</span>
                  </>
                )}
              </div>
              <div className="savings">
                Vous économisez {
                  product.discounted && product.discounted > product.price 
                    ? (product.discounted - product.price).toFixed(2) 
                    : product.price.toFixed(2)
                } {shop.currency} !
              </div>
            </div>

            {/* Timer Urgence */}
            <div className="urgency-timer">
              ⏰ Offre limitée : {formatTime(timeLeft)}
            </div>

            {/* Points Clés Produit */}
            <div className="key-features">
              {product.desc ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: product.desc
                    .replace(/<ul>/g, '')
                    .replace(/<\/ul>/g, '')
                    .replace(/<li>/g, '✓ ')
                    .replace(/<\/li>/g, '<br/>')
                    .split('<br/>').slice(0, 4).join('<br/>')
                }} />
              ) : (
                <div>
                  ✓ Produit de qualité supérieure<br/>
                  ✓ Livraison rapide et gratuite<br/>
                  ✓ Garantie satisfait ou remboursé<br/>
                  ✓ Service client disponible 7j/7
                </div>
              )}
            </div>

            {/* Informations et Options Produit */}
            <ProductInfos 
              data={data} 
              product={product} 
              handleAddToCart={handleAddToCart} 
              buttonText={buttonText} 
              shop={shop}
              onOptionChange={(optionImageUrl) => console.log('Option image changed:', optionImageUrl)}
            />

            {/* Garanties */}
            <div className="guarantees-landing">
              <div className="guarantee-item">
                <strong>✅ Retour offert</strong><br/>90 jours
              </div>
              <div className="guarantee-item">
                <strong>🛡️ Garantie</strong><br/>2 ans
              </div>
              <div className="guarantee-item">
                <strong>🚚 Livraison</strong><br/>gratuite
              </div>
              <div className="guarantee-item">
                <strong>📦 Expédié</strong><br/>sous 24h
              </div>
            </div>
          </div>
        </section>

        {/* Avis Clients */}
        <Testimonials data={data} shop={shop} reviews={reviews} />

        {/* Section Détails du Produit */}
        <section className="product-details">
          {product.advantages && (<div className={`wrapper advantages bg-main ${shop.id !== 2 && 'full'}`}><article dangerouslySetInnerHTML={{ __html: product.advantages }} /></div>)}
          {product.more1 && (<div className="wrapper more" dangerouslySetInnerHTML={{ __html: product.more1 }} />)}
          {product.more2 && (<div className="wrapper more" dangerouslySetInnerHTML={{ __html: product.more2 }} />)}
          {product.more3 && (<div className="wrapper more" dangerouslySetInnerHTML={{ __html: product.more3 }} />)}
        </section>

        {/* CTA Sticky Mobile */}
        <div className="sticky-cta-mobile">
          <div className="sticky-price">
            <span className="sticky-old-price">
              {product.discounted && product.discounted > product.price 
                ? product.discounted.toFixed(2) 
                : (product.price * 2).toFixed(2)} {shop.currency}
            </span>
            <span className="sticky-new-price">{product.price.toFixed(2)} {shop.currency}</span>
          </div>
          <button 
            className="sticky-cta-button"
            onClick={handleAddToCart}
          >
            COMMANDER (-50%)
          </button>
        </div>

        {/* Footer Informationnel */}
        <footer className="landing-footer-info">
          <div className="footer-info-content">
            <div className="footer-info-main">
              <div className="footer-logo-section">
                <img src={brand.logo} alt={shop.name} className="footer-logo" />
                <h3>{shop.name}</h3>
                <p className="footer-description">
                  {data?.about || "Votre boutique de confiance pour des produits de qualité exceptionnelle."}
                </p>
              </div>
              
              <div className="footer-contact-info">
                <h4>Informations boutique</h4>
                <div className="info-item">
                  <strong>📧 Service client</strong>
                  <span>{shop.email || "contact@" + shop.domain}</span>
                </div>
                <div className="info-item">
                  <strong>🚚 Livraison</strong>
                  <span>Gratuite dès 20€ - Expédition sous 24h</span>
                </div>
                <div className="info-item">
                  <strong>🛡️ Garanties</strong>
                  <span>Satisfait ou remboursé 90 jours</span>
                </div>
              </div>

              <div className="footer-policies-info">
                <h4>Nos engagements</h4>
                <div className="policy-item">
                  <strong>✅ Paiements sécurisés</strong>
                  <span>Toutes vos transactions sont protégées</span>
                </div>
                <div className="policy-item">
                  <strong>🔒 Données protégées</strong>
                  <span>Vos informations restent confidentielles</span>
                </div>
                <div className="policy-item">
                  <strong>🌟 Qualité garantie</strong>
                  <span>Produits testés et certifiés</span>
                </div>
                <div className="policy-item">
                  <strong>⏰ Horaires</strong>
                  <span>Service client : Lun-Dim 8h00 - 20h00</span>
                </div>
              </div>
            </div>

            <div className="footer-bottom-info">
              <div className="footer-legal-info">
                <p>&copy; {new Date().getFullYear()} {shop.name}. Tous droits réservés.</p>
                <p className="legal-text">
                  Conditions générales de vente • Politique de confidentialité • Mentions légales
                </p>
              </div>
              <div className="footer-badges-info">
                <div className="badge-info">🔒 SSL</div>
                <div className="badge-info">✅ Vérifié</div>
                <div className="badge-info">🛡️ Sécurisé</div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <section className="badge-container">
        <ReviewsBadge domain={shop.domain} logo={brand.logo} count={data.reviewCount} reviews={reviews} reviewCtaHead={data.reviewCtaHead} />
      </section>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { landing } = query;

  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });
  const reviews = await fetchData('reviews', { match: { shop_id: process.env.SHOP_ID } });

  // Trouver le produit par slug
  const product = products.find(p => p.slug === landing);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
      shop: shop[0],
      brand: brand[0],
      data: data[0],
      reviews: reviews,
    },
  };
}