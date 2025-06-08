import React, { useRef } from 'react';

const Reviews = ({ reviews, product }) => {
    const sliderRef = useRef(null);
    
    // Debug: afficher les données reçues
    // console.log('Reviews component - product ID:', product);
    // console.log('Reviews component - all reviews:', reviews);
      // Filtrer les avis par l'ID du produit
    const productReviews = reviews ? reviews.filter(review => {
        // console.log('Comparing review.product_id:', review.product_id, 'with product:', product);
        // Comparaison avec conversion en chaîne pour éviter les problèmes de type
        return String(review.product_id) === String(product);
    }) : [];
    
    //console.log('Filtered product reviews:', productReviews);
    
    if (!productReviews || productReviews.length === 0) {
        //console.log('No reviews found for this product');
        return null;
    }

    return (
        <section className="product-reviews">
            <div className='wrapper' ref={sliderRef}>
                <div className='slider'>
                    {productReviews
                        .slice()                                     // duplique le tableau
                        .sort((a, b) => (a.order || 999) - (b.order || 999)) // Tri croissant par order (1 = plus récent)
                        .map((review, index) => (
                            <div key={index} className='slide'>
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
                                {review.img && <img src={review.img} alt={review.content} />}
                                <p className='review-content'>{review.content}</p>
                                <span className="review-info">
                                    Avis publié le <b>{review.reviewDate}</b> suite à un achat le{' '}
                                    {review.experienceDate} par <b>{review.author}</b>
                                </span>
                            </div>
                        ))
                   }
                </div>
            </div>
        </section>
    );
};

export default Reviews;