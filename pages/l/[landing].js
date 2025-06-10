import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import Head from '../../components/Head';
import Reviews from '../../components/Reviews';

import {fetchData} from '../../lib/supabase.mjs';

export default function Landing({ product, shop, brand, data, reviews }) {
  const [cartCount, setCartCount] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [buttonText, setButtonText] = useState('COMMANDER MAINTENANT (-50%)');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => {
    return 7 * 3600 + 37 * 60 + 20;
  });

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
        const newTime = prevTime - 1;
        if (newTime <= 0) return 0;
        return newTime;
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

  const handleAddToCart = async () => {
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

    setButtonText('✅ PRODUIT AJOUTÉ !');
    setTimeout(() => setButtonText('COMMANDER MAINTENANT (-50%)'), 2000);
    
    // Redirection directe vers checkout
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 1000);

    gtag_report_conversion();
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
  const productOptions = product.options ? (Array.isArray(product.options) ? product.options : JSON.parse(product.options)) : [];

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
      
      <div className="landing-container">
        {/* Header Ultra-Simplifié */}
        <header className="landing-header">
          <div className="header-content">
            <img src={brand.logo} alt={shop.name} className="logo" />
            <div className="cart-icon">
              🛒 <span className="cart-count">{cartCount}</span>
            </div>
          </div>
        </header>

        {/* Bannière USP Statique */}
        <section className="usp-banner">
          <div className="usp-items">
            <div className="usp-item">📦 Livraison 48h</div>
            <div className="usp-item">✅ Satisfait ou Remboursé</div>
            <div className="usp-item flash">🔥 -50% Aujourd'hui</div>
          </div>
        </section>

        {/* Section Produit Principal */}
        <section className="product-hero-landing">
          
          {/* Images Produit */}
          <div className="product-images-landing">
            {images[selectedImageIndex] && (
              <img
                src={images[selectedImageIndex]}
                alt={product.title}
                className="main-product-image"
              />
            )}
            {images.length > 1 && (
              <div className="thumbnail-gallery">
                {images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`thumbnail-landing ${selectedImageIndex === index ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>

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
                {product.discounted ? (
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
              <div className="savings">Vous économisez {product.discounted ? (product.discounted - product.price).toFixed(2) : product.price.toFixed(2)} {shop.currency} !</div>
            </div>

            {/* Timer Urgence */}
            <div className="urgency-timer">
              ⏰ Offre limitée : {formatTime(timeLeft)}
            </div>

            {/* Points Clés Produit */}
            <div className="key-features">
              <div dangerouslySetInnerHTML={{ 
                __html: product.desc
                  .replace(/<ul>/g, '')
                  .replace(/<\/ul>/g, '')
                  .replace(/<li>/g, '✓ ')
                  .replace(/<\/li>/g, '<br/>')
                  .split('<br/>').slice(0, 4).join('<br/>')
              }} />
            </div>

            {/* Options Produit */}
            {productOptions.length > 0 && (
              <div className="product-options-landing">
                <h3>Options disponibles :</h3>
                <div className="options-grid">
                  {productOptions.map((option, index) => (
                    <div 
                      key={index}
                      className={`option-item ${selectedOptionIndex === index ? 'selected' : ''}`}
                      onClick={() => setSelectedOptionIndex(index)}
                    >
                      {option.image && <img src={option.image} alt={option.name} />}
                      <span>{option.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA PRINCIPAL */}
            <div className="cta-section-landing">
              <button 
                className="main-cta-landing"
                onClick={handleAddToCart}
              >
                {buttonText}
              </button>
              <div className="cta-benefits">
                <div>🚚 Livraison gratuite</div>
                <div>📦 Expédié sous 24h</div>
                <div>🔒 Paiement sécurisé</div>
              </div>
            </div>

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

        {/* Avis Clients Condensés */}
        <section className="reviews-landing">
          <h2>⭐ Avis vérifiés clients</h2>
          <div className="reviews-grid-landing">
            {reviews.slice(0, 3).map((review, index) => (
              <div key={index} className="review-card-landing">
                <div className="stars">{'⭐'.repeat(5)}</div>
                <p>"{review.comment}"</p>
                <span>- {review.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Sticky Mobile */}
        <div className="sticky-cta-mobile">
          <div className="sticky-price">
            <span className="sticky-old-price">{product.discounted ? product.discounted.toFixed(2) : (product.price * 2).toFixed(2)} {shop.currency}</span>
            <span className="sticky-new-price">{product.price.toFixed(2)} {shop.currency}</span>
          </div>
          <button 
            className="sticky-cta-button"
            onClick={handleAddToCart}
          >
            COMMANDER (-50%)
          </button>
        </div>

        {/* Footer Landing Page */}
        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-logo-section">
                <img src={brand.logo} alt={shop.name} className="footer-logo" />
                <h3>{shop.name}</h3>
                <p className="footer-description">
                  {data?.about || "Votre boutique de confiance pour des produits de qualité exceptionnelle."}
                </p>
              </div>
              
              <div className="footer-info">
                <h4>Informations boutique</h4>
                <div className="info-item">
                  <strong>📧 Service client :</strong><br/>
                  <span>{shop.email || "contact@" + shop.domain}</span>
                </div>
                <div className="info-item">
                  <strong>🚚 Livraison :</strong><br/>
                  <span>Gratuite dès 50€ - Expédition sous 24h</span>
                </div>
                <div className="info-item">
                  <strong>🛡️ Garanties :</strong><br/>
                  <span>Satisfait ou remboursé 90 jours</span>
                </div>
              </div>

              <div className="footer-policies">
                <h4>Nos engagements</h4>
                <div className="policy-item">
                  <strong>✅ Paiements sécurisés</strong><br/>
                  <span>Toutes vos transactions sont protégées</span>
                </div>
                <div className="policy-item">
                  <strong>🔒 Données protégées</strong><br/>
                  <span>Vos informations restent confidentielles</span>
                </div>
                <div className="policy-item">
                  <strong>🌟 Qualité garantie</strong><br/>
                  <span>Produits testés et certifiés</span>
                </div>
              </div>

              <div className="footer-contact">
                <h4>Une question ?</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <strong>📞 Téléphone :</strong><br/>
                    <span>{shop.phone || "Service disponible 7j/7"}</span>
                  </div>
                  <div className="contact-item">
                    <strong>⏰ Horaires :</strong><br/>
                    <span>Lun-Dim : 8h00 - 20h00</span>
                  </div>
                  <div className="contact-item">
                    <strong>📍 Localisation :</strong><br/>
                    <span>{shop.address || "France métropolitaine"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-legal">
                <p>&copy; {new Date().getFullYear()} {shop.name}. Tous droits réservés.</p>
                <p className="legal-text">
                  Conditions générales de vente • Politique de confidentialité • Mentions légales
                </p>
              </div>
              <div className="footer-badges">
                <div className="badge">🔒 SSL</div>
                <div className="badge">✅ Vérifié</div>
                <div className="badge">🛡️ Sécurisé</div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .landing-container {
          font-family: ${brand.font || 'Arial, sans-serif'};
          color: ${brand.colorBlack || '#000'};
          min-height: 100vh;
        }

        .landing-header {
          background: white;
          padding: 15px 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .logo {
          height: 40px;
        }

        .cart-icon {
          font-size: 24px;
          position: relative;
          cursor: pointer;
        }

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: ${brand.colorPrimary || '#ff4444'};
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .usp-banner {
          background: ${brand.colorPrimary || '#ff4444'};
          color: white;
          padding: 15px 0;
          text-align: center;
        }

        .usp-items {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .usp-item {
          font-weight: bold;
          font-size: 14px;
        }

        .usp-item.flash {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .product-hero-landing {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .product-hero-landing {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 20px;
          }
        }

        .main-product-image {
          width: 100%;
          height: auto;
          border-radius: ${brand.radiusMedium || '10px'};
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .thumbnail-gallery {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          justify-content: center;
        }

        .thumbnail-landing {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s;
        }

        .thumbnail-landing.active {
          border-color: ${brand.colorPrimary || '#ff4444'};
        }

        .top-badge {
          background: #ff4444;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 15px;
        }

        .product-title-landing {
          font-size: 32px;
          font-weight: bold;
          margin: 0 0 20px 0;
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .product-title-landing {
            font-size: 24px;
          }
        }

        .price-section-landing {
          background: ${brand.bgLight || '#f8f9fa'};
          padding: 25px;
          border-radius: ${brand.radiusMedium || '10px'};
          margin: 20px 0;
          text-align: center;
          border: 3px solid ${brand.colorPrimary || '#ff4444'};
        }

        .flash-offer {
          background: #ff4444;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 15px;
          animation: pulse 2s infinite;
        }

        .price-container {
          margin: 15px 0;
        }

        .old-price {
          font-size: 20px;
          text-decoration: line-through;
          color: #999;
          margin-right: 15px;
          display: block;
        }

        .new-price {
          font-size: 42px;
          font-weight: bold;
          color: ${brand.colorPrimary || '#ff4444'};
          display: block;
        }

        @media (max-width: 768px) {
          .new-price {
            font-size: 32px;
          }
        }

        .savings {
          color: #28a745;
          font-weight: bold;
          font-size: 16px;
          margin-top: 10px;
        }

        .urgency-timer {
          background: linear-gradient(45deg, #ff4444, #ff6666);
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          font-weight: bold;
          font-size: 18px;
          margin: 20px 0;
          animation: pulse 3s infinite;
        }

        .key-features {
          background: white;
          border: 2px solid ${brand.colorPrimary || '#ff4444'};
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          font-size: 16px;
          line-height: 1.6;
        }

        .product-options-landing {
          margin: 25px 0;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .option-item {
          border: 2px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .option-item.selected {
          border-color: ${brand.colorPrimary || '#ff4444'};
          background: ${brand.bgLight || '#f8f9fa'};
        }

        .option-item img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .cta-section-landing {
          margin: 30px 0;
        }

        .main-cta-landing {
          width: 100%;
          background: linear-gradient(45deg, ${brand.colorPrimary || '#ff4444'}, #ff6666);
          color: white;
          border: none;
          padding: 25px;
          font-size: 22px;
          font-weight: bold;
          border-radius: ${brand.radiusMedium || '10px'};
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 5px 20px rgba(255, 68, 68, 0.4);
        }

        .main-cta-landing:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 68, 68, 0.6);
        }

        @media (max-width: 768px) {
          .main-cta-landing {
            font-size: 20px;
            padding: 20px;
          }
        }

        .cta-benefits {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .cta-benefits {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }

        .guarantees-landing {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 25px 0;
        }

        .guarantee-item {
          text-align: center;
          padding: 15px;
          background: ${brand.bgLight || '#f8f9fa'};
          border-radius: 8px;
          font-size: 13px;
          border: 1px solid #e0e0e0;
        }

        .reviews-landing {
          background: ${brand.bgLight || '#f8f9fa'};
          padding: 50px 20px;
          text-align: center;
        }

        .reviews-landing h2 {
          margin-bottom: 40px;
          font-size: 28px;
          color: ${brand.colorBlack || '#000'};
        }

        .reviews-grid-landing {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .review-card-landing {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }

        .review-card-landing:hover {
          transform: translateY(-5px);
        }

        .stars {
          font-size: 20px;
          margin-bottom: 15px;
        }

        .review-card-landing p {
          font-style: italic;
          margin: 15px 0;
          color: #333;
          font-size: 15px;
          line-height: 1.5;
        }

        .review-card-landing span {
          font-weight: bold;
          color: #666;
          font-size: 14px;
        }

        .sticky-cta-mobile {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          padding: 15px 20px;
          box-shadow: 0 -5px 20px rgba(0,0,0,0.15);
          display: none;
          z-index: 1000;
          border-top: 2px solid ${brand.colorPrimary || '#ff4444'};
        }

        @media (max-width: 768px) {
          .sticky-cta-mobile {
            display: flex;
            align-items: center;
            gap: 15px;
          }
        }

        .sticky-price {
          flex: 1;
        }

        .sticky-old-price {
          font-size: 14px;
          text-decoration: line-through;
          color: #999;
          display: block;
        }

        .sticky-new-price {
          font-size: 20px;
          font-weight: bold;
          color: ${brand.colorPrimary || '#ff4444'};
        }

        .sticky-cta-button {
          background: linear-gradient(45deg, ${brand.colorPrimary || '#ff4444'}, #ff6666);
          color: white;
          border: none;
          padding: 15px 25px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          white-space: nowrap;
          font-size: 16px;
          text-transform: uppercase;
        }

        .landing-footer {
          background: ${brand.bgDark || '#2c3e50'};
          color: white;
          padding: 50px 20px 30px 20px;
          margin-top: 60px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-main {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: 30px;
            text-align: center;
          }
        }

        .footer-logo-section h3 {
          color: white;
          font-size: 24px;
          margin: 15px 0 10px 0;
          font-weight: bold;
        }

        .footer-logo {
          height: 50px;
          margin-bottom: 15px;
          filter: brightness(0) invert(1);
        }

        .footer-description {
          font-size: 14px;
          color: #bdc3c7;
          line-height: 1.6;
          margin: 0;
        }

        .footer-info h4,
        .footer-policies h4,
        .footer-contact h4 {
          color: ${brand.colorPrimary || '#ff4444'};
          font-size: 18px;
          margin-bottom: 20px;
          font-weight: bold;
        }

        .info-item,
        .policy-item,
        .contact-item {
          margin-bottom: 15px;
          font-size: 14px;
        }

        .info-item strong,
        .policy-item strong,
        .contact-item strong {
          color: white;
          font-weight: bold;
          display: block;
          margin-bottom: 5px;
        }

        .info-item span,
        .policy-item span,
        .contact-item span {
          color: #bdc3c7;
          line-height: 1.4;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        @media (max-width: 768px) {
          .contact-info {
            align-items: center;
          }
        }

        .footer-bottom {
          border-top: 1px solid #34495e;
          padding-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 768px) {
          .footer-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }

        .footer-legal p {
          font-size: 13px;
          color: #bdc3c7;
          margin: 5px 0;
        }

        .legal-text {
          font-size: 12px !important;
          color: #95a5a6 !important;
        }

        .footer-badges {
          display: flex;
          gap: 15px;
        }

        @media (max-width: 768px) {
          .footer-badges {
            justify-content: center;
          }
        }

        .badge {
          background: ${brand.colorPrimary || '#ff4444'};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid ${brand.colorPrimary || '#ff4444'};
        }
      `}</style>
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