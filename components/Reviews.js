import React, { useRef } from 'react';

const Reviews = ({ product }) => {
    const sliderRef = useRef(null);
    const hasReviews = product && product.reviews && product.reviews.length > 0;

    if (!hasReviews) {
        return null;
    }

    return (
        <section className="product-reviews">
            <div className='wrapper' ref={sliderRef}>
                <div className='slider'>
                    {product.reviews
                        .slice()                                     // duplique le tableau
                        .sort((a, b) => new Date(b.id) - new Date(a.id)) // tri desc. sur id
                        .map((review, index) => (
                            <div key={index} className='slide'>
                                {product.reviewImages && product.reviewImages.length >= 3 && product.reviewImages[index] && (
                                    <img
                                        src={product.reviewImages[index]}
                                        alt={`Review ${index + 1}`}
                                        className='review-image'
                                    />
                                )}
                                <div dangerouslySetInnerHTML={{ __html: review }} />
                            </div>
                        ))
                   }
                </div>
            </div>
        </section>
    );
};

export default Reviews;