import React, { useState, useEffect, useRef } from 'react';

const ProductImages = ({ 
  images = [], 
  productTitle = '',
  variant = 'default', // 'default' or 'landing'
  onImageChange = null // callback when image changes (for option handling)
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [visibleImageIndex, setVisibleImageIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle image click
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    if (onImageChange) {
      onImageChange(index);
    }
  };

  // Handle mouse move for zoom effect
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  // Handle next images in slider
  const handleNextImages = () => {
    if (visibleImageIndex + 1 < images.length) {
      setVisibleImageIndex(visibleImageIndex + 1);
      setSelectedImageIndex(visibleImageIndex + 1);
    } else {
      setVisibleImageIndex(0);
      setSelectedImageIndex(0);
    }
  };

  // Open popup
  const openPopup = () => {
    if (variant !== 'landing') {
      setIsPopupVisible(true);
    }
  };

  // Close popup
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  // Update mouse position for zoom effect
  useEffect(() => {
    const largeImage = document.querySelector('.large-image');
    if (largeImage) {
      largeImage.style.setProperty('--mouse-x', `${mousePosition.x}%`);
      largeImage.style.setProperty('--mouse-y', `${mousePosition.y}%`);
    }
  }, [mousePosition]);

  // Calculate visible images for slider
  const visibleImages = images.slice(visibleImageIndex, visibleImageIndex + 4);
  if (visibleImages.length < 4 && images.length > 4) {
    visibleImages.push(...images.slice(0, 4 - visibleImages.length));
  }

  // For landing variant, show only first 4 images
  const displayImages = variant === 'landing' ? images.slice(0, 4) : visibleImages;

  if (!images || images.length === 0) {
    return <div className="product-image no-images">Aucune image disponible</div>;
  }

  return (
    <>
      {/* Popup for full screen view */}
      {isPopupVisible && (
        <div className="popup-overlay" onClick={closePopup}>
          <button className="close-popup" onClick={closePopup}>
            <i className="fas fa-times"></i>
          </button>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[selectedImageIndex]}
              alt={productTitle}
              className="popup-image"
            />
            <div className="popup-thumbnail-container">
              {displayImages.map((image, index) => (
                image && (
                  <img
                    key={variant === 'landing' ? index : index + visibleImageIndex}
                    src={image}
                    alt={`${productTitle} ${index + 1}`}
                    onClick={() => handleImageClick(variant === 'landing' ? index : index + visibleImageIndex)}
                    className={`thumbnail ${selectedImageIndex === (variant === 'landing' ? index : index + visibleImageIndex) ? 'selected' : ''}`}
                  />
                )
              ))}
              {images.length > 4 && variant !== 'landing' && (
                <button className="next-button" onClick={handleNextImages}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main image display */}
      <div className={`product-image ${variant === 'landing' ? 'product-images-landing' : ''}`}>
        {images[selectedImageIndex] && (
          <img
            src={images[selectedImageIndex]}
            alt={productTitle}
            className={`large-image ${variant === 'landing' ? 'main-product-image' : ''}`}
            onMouseMove={variant !== 'landing' ? handleMouseMove : undefined}
            onClick={openPopup}
            style={{ cursor: variant !== 'landing' ? 'zoom-in' : 'pointer' }}
          />
        )}
        
        {/* Thumbnail gallery */}
        {images.length > 1 && (
          <div className={`thumbnail-container ${variant === 'landing' ? 'thumbnail-gallery' : ''}`}>
            {displayImages.map((image, index) => (
              image && (
                <img
                  key={variant === 'landing' ? index : index + visibleImageIndex}
                  src={image}
                  alt={`${productTitle} ${index + 1}`}
                  onClick={() => handleImageClick(variant === 'landing' ? index : index + visibleImageIndex)}
                  className={`thumbnail ${variant === 'landing' ? 'thumbnail-landing' : ''} ${
                    selectedImageIndex === (variant === 'landing' ? index : index + visibleImageIndex) ? 
                    (variant === 'landing' ? 'active' : 'selected') : ''
                  }`}
                />
              )
            ))}
            {images.length > 4 && variant !== 'landing' && (
              <button className="next-button" onClick={handleNextImages}>
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductImages;