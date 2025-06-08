import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const CheckoutSummary = ({ cart, data, shop, name }) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promoRate = 10 / 100;
  // montant de la remise :
  //   – si promo appliquée et total ≤ 20 € → 5 €
  //   – si promo appliquée et total > 20 € → 10 €
  //   – sinon remise classique en %.
  const discountAmount = promoApplied
    ? (cartTotal <= 20 ? 5 : 10)
    : cartTotal * promoRate;
  const finalTotal = cartTotal - discountAmount;

  const handleApply = () => {
    if (/^SIMU10\d{3}$/i.test(promoCode)) {
      setPromoApplied(true);
    } else {
      alert('Code invalide');
      setPromoApplied(false);
    }
  };

  const getDeliveryDate = (deliveryType) => {
    const today = new Date();
    let deliveryDays;
    if (deliveryType === 'Express') {
      deliveryDays = 4;
    } else if (deliveryType === 'Fast') {
      deliveryDays = 5;
    } else if (deliveryType === 'Normal') {
      deliveryDays = 6;
    } else {
      return '';
    }
    const deliveryDate = addDays(today, deliveryDays);
    return format(deliveryDate, 'EEEE d MMMM', { locale: fr });
  };

  const getCurrentMonth = () => {
    return format(new Date(), 'MMM', { locale: fr }).toUpperCase();
  };


  return (
    <>
      <div className="shop-info">
        <h2>{data.checkoutPayLabel}</h2>
        {/* Affiche le total après remise */}
        <h1 className="color-primary">
          {finalTotal.toFixed(2)} {shop.currency}
        </h1>
      </div>

      <div className="cart-summary">        <ul>
          {cart.map((item, i) => (
            <li key={i}>
              <div className="cart-item">
                <div className="item-details">
                  <h4>{item.title}</h4>
                  {item.selectedOption && (
                    <p className="selected-option">{item.selectedOption.title}</p>
                  )}
                </div>
                <p className="quantity">(x{item.quantity})</p>
                <p>{item.price.toFixed(2)} {shop.currency}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Promo « fin de saison » ou « bienvenue simulateur » */}
        <div className="cart-item discount">
          <h4>
            {promoApplied
              ? 'Promotion Simulateur Bienvenue'
              : `Promotion fin de saison : ${getCurrentMonth()}10`}
          </h4>
          <p className="quantity">
            {promoApplied ? '' : `-${(promoRate * 100).toFixed(0)}%`}
          </p>
          <p>
            -{discountAmount.toFixed(2)} {shop.currency}
          </p>
        </div>

        {/* Zone de saisie du code */}
        <div className="cart-item discount promo">
          <h4>
            CODE MEMBRE : 
            <input
              type="text"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
              placeholder=""
              maxLength={9}
              disabled={promoApplied}
            />
            <button
            onClick={handleApply}
            disabled={promoApplied}
            >Appliquer</button>
          </h4>
          <p className="quantity">
            
          </p>
          <p className='color-primary'>{promoApplied ? promoCode : ''}</p>
        </div>

        {/* Livraison, sous‐total avant promo, etc. */}
        <div className="cart-item discount">
          <h4>{data.productDeliveryLabel}</h4>
          <p className="quantity delivery">
            {cart[0] && getDeliveryDate(cart[0].delivery)}
          </p>
          <p>{data.checkoutFreeLabel}</p>
        </div>

        <div className="cart-item subtotal">
          <h4>{data.checkoutBeforePromo}</h4>
          <p>
            {cartTotal.toFixed(2)} {shop.currency}
          </p>
        </div>

        {/* Total final */}
        <div className="total-price">
          <h4>{data.cartTotal}</h4>
          <p>
            {finalTotal.toFixed(2)} {shop.currency}
          </p>
        </div>
      </div>

      <p className="secure footer">
        2025 © {data.footerCopyright} - {name} INC. 32455
      </p>
    </>
  );
};

export default CheckoutSummary;