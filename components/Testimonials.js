import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import ReviewsBadge from './ReviewsBadge';

const Testimonials = ({shop, data, reviews}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(4); // Par défaut, 4 avis par page
  const hiddenBadgeRef = useRef(null);

  // Détecter si l'utilisateur est sur un appareil mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setReviewsPerPage(1); // 1 avis par page en version mobile
      } else {
        setReviewsPerPage(4); // 4 avis par page sur desktop
      }
    };

    handleResize(); // Vérifier au chargement
    window.addEventListener('resize', handleResize); // Écouter les changements de taille

    return () => {
      window.removeEventListener('resize', handleResize); // Nettoyer l'écouteur
    };
  }, []);



  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, reviews.length - reviewsPerPage) : prevIndex - reviewsPerPage
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + reviewsPerPage >= reviews.length ? 0 : prevIndex + reviewsPerPage
    );
  };

  const handleOpenReviews = () => {
    // Essayer d'abord de cliquer sur le badge du header
    const headerBadge = document.querySelector("section.badge-container > img");
    
    if (headerBadge) {
      headerBadge.click();
    } else {
      // Si pas de badge dans le header, cliquer sur le badge caché
      setTimeout(() => {
        if (hiddenBadgeRef.current) {
          const hiddenBadgeImg = hiddenBadgeRef.current.querySelector('img[alt="Avis vérifiés"]');
          if (hiddenBadgeImg) {
            console.log('Clicking hidden badge...');
            hiddenBadgeImg.click();
          } else {
            console.log('No hidden badge img found');
          }
        } else {
          console.log('No hidden badge ref');
        }
      }, 50);
    }
  };
  // Trier les avis par la colonne "order" (du plus récent au plus vieux)
  const sortedReviews = reviews
    .slice()                                     // duplique le tableau
    .sort((a, b) => (a.order || 999) - (b.order || 999)); // Tri croissant par order (1 = plus récent)

  const currentReviews = sortedReviews.slice(currentIndex, currentIndex + reviewsPerPage);

  return (
    <section className="testimonials" id='reviews'>
      <div className="wrapper">
        <img onClick={handleOpenReviews} src="https://bpybtzxqypswjiizkzja.supabase.co/storage/v1/object/public/ecom/christopeit-france/avis-verifies.svg" alt="Avis vérifiés" />
        <h2>{data.reviewLabel} <span>{shop.domain.toLowerCase()}</span></h2>
        <span className="info-rate">{data.reviewDesc}</span>
        <div className="testimonials-slider">
          <button className="slider-arrow left" onClick={handlePrev}>
            &#8249;
          </button>
          <div className="testimonial-list">
            {currentReviews.map((review, index) => (
              <div key={index} className="testimonial">
                <article className="star-head">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`stars-item ${i < Number(review.stars) ? 'full' : ''}`}
                      ></span>
                    ))}
                  </div>
                  <span className="rate">
                    <b>{review.stars}</b>/5
                  </span>
                </article>
                <p className='review-content'>{review.content}</p>
                <span className="review-info">
                  {data.reviewInfo1} <b>{review.reviewDate}</b>{data.reviewInfo2}{' '}
                  {review.experienceDate} {data.reviewInfo3} <b>{review.author}</b>
                </span>
              </div>
            ))}
          </div>
          <button className="slider-arrow right" onClick={handleNext}>
            &#8250;
          </button>
        </div>
        <button onClick={handleOpenReviews} className='view-more'>{data.reviewCta}</button>
      </div>

      {/* ReviewsBadge caché pour les pages sans header */}
      <div 
        ref={hiddenBadgeRef} 
        style={{ 
          position: 'fixed', 
          left: '-1000px', 
          top: '-1000px',
          zIndex: -1,
          pointerEvents: 'auto'
        }}
      >
        <ReviewsBadge 
          count={reviews.length}
          domain={shop.domain}
          logo={shop.logo || '/logo.png'}
          reviewCtaHead={data.reviewCtaHead || 'Voir tous les avis'}
          reviews={reviews}
        />
      </div>
    </section>
  );
};

export default Testimonials;