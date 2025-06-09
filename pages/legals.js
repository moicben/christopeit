import Head from '../components/Head';
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from 'lib/supabase.mjs';

export default function Mentions({shop, brand, categories, data, reviews}) {
  return (
    <div className="container">
      <Head name={shop.name} domain={shop.domain} tag={shop.tag} pixel={shop.pixel} hotjar={shop.hotjar}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.legalsPageLabel} - ${shop.name}`}
      />
      
      <main>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
        
        <section className='legal'>
          <h1>{data.legalsPageLabel}</h1>
          <div>

       
          <p>Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance en l'économie numérique, nous vous informons des mentions légales du site {shop.name}.</p>

<h2>1. Informations sur l'éditeur du site</h2>
<div className="info-box">
    <p><strong>Site web :</strong> <a href={`https://www.${shop.domain}`} target="_blank">www.{shop.domain}</a></p>
    <p><strong>Dénomination sociale :</strong> {shop.name} SAS</p>
    <p><strong>Forme juridique :</strong> Société par Actions Simplifiées (SAS)</p>
    <p><strong>Capital social :</strong> [À compléter selon vos statuts]</p>
    <p><strong>Numéro d'immatriculation RCS :</strong> 851 990 135</p>
    <p><strong>Numéro de SIRET :</strong> 85199013500028</p>
    <p><strong>Numéro de TVA intracommunautaire :</strong> FR47851990135</p>
    <p><strong>Code APE/NAF :</strong> [À compléter selon votre activité]</p>
</div>

<div className="contact-info">
    <h3>Coordonnées</h3>
    <p><strong>Adresse du siège social :</strong><br/>
    125 RUE DE L'ARTISANAT<br/>
    42110 CIVENS<br/>
    FRANCE</p>
    
    <p><strong>Directeur de la publication :</strong> Véronique BERENGÈRE</p>
    <p><strong>Responsable éditorial :</strong> Véronique BERENGÈRE</p>
    <p><strong>Contact email :</strong> <a href={`mailto:support@${shop.domain}`}>support@{shop.domain}</a></p>
    <p><strong>Téléphone :</strong> [À compléter si souhaité]</p>
</div>

<h2>2. Hébergement du site</h2>
<div className="info-box">
    <p><strong>Hébergeur :</strong> Hostinger International Ltd</p>
    <p><strong>Adresse :</strong><br/>
    61 Lordou Vironos Street<br/>
    6023 Larnaca<br/>
    Chypre</p>
    <p><strong>Site web :</strong> <a href="https://www.hostinger.fr" target="_blank">https://www.hostinger.fr</a></p>
    <p><strong>Contact :</strong> Disponible via leur site web</p>
</div>

<h2>3. Propriété intellectuelle</h2>
<p>L'ensemble du contenu du site {shop.name} (textes, images, photographies, logos, graphismes, icônes, vidéos, sons, plans, noms, slogans) est protégé par les dispositions du Code de la propriété intellectuelle et par les conventions internationales relatives au droit d'auteur et aux droits voisins.</p>

<div className="important">
    <p><strong>Propriété exclusive :</strong> Tous les éléments du site sont et restent la propriété intellectuelle exclusive de {shop.name}. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie de ces éléments, est strictement interdite sans l'autorisation écrite préalable de {shop.name}.</p>
</div>

<p>Les marques et logos présents sur le site sont déposés par {shop.name} ou éventuellement par des partenaires. Toute reproduction totale ou partielle de ces marques ou logos, effectuée à partir des éléments du site sans l'autorisation expresse de {shop.name} est prohibée.</p>

<h2>4. Protection des données personnelles et RGPD</h2>
<p>Conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la loi Informatique et Libertés modifiée, {shop.name} s'engage à protéger la vie privée des utilisateurs de son site web.</p>

<h3>4.1 Responsable de traitement</h3>
<p>{shop.name} SAS, représentée par Véronique BERENGÈRE, est responsable du traitement des données personnelles collectées sur le site www.{shop.domain}.</p>

<h3>4.2 Finalités du traitement</h3>
<p>Les informations collectées sont destinées exclusivement à :</p>
<ul>
    <li>La gestion des commandes et de la relation client</li>
    <li>L'amélioration de nos services et de votre expérience utilisateur</li>
    <li>L'envoi d'informations commerciales (avec votre consentement)</li>
    <li>Le respect de nos obligations légales et réglementaires</li>
</ul>

<h3>4.3 Vos droits</h3>
<p>Conformément à la réglementation en vigueur, vous disposez des droits suivants concernant vos données personnelles :</p>
<ul>
    <li>Droit d'accès et de consultation de vos données</li>
    <li>Droit de rectification des données inexactes</li>
    <li>Droit d'effacement de vos données</li>
    <li>Droit à la portabilité de vos données</li>
    <li>Droit de limitation du traitement</li>
    <li>Droit d'opposition au traitement</li>
    <li>Droit de retirer votre consentement à tout moment</li>
</ul>

<p>Pour exercer ces droits, contactez-nous à l'adresse : <a href={`mailto:support@${shop.domain}`}>support@{shop.domain}</a></p>

<p>Vous disposez également du droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) si vous estimez que le traitement de vos données personnelles constitue une violation de la réglementation applicable.</p>

<h2>5. Cookies et technologies similaires</h2>
<p>Notre site utilise des cookies et technologies similaires pour améliorer votre expérience de navigation, analyser l'utilisation du site et proposer des contenus personnalisés.</p>

<h3>5.1 Types de cookies utilisés</h3>
<ul>
    <li><strong>Cookies techniques :</strong> Nécessaires au fonctionnement du site</li>
    <li><strong>Cookies analytiques :</strong> Pour mesurer l'audience et améliorer le site</li>
    <li><strong>Cookies fonctionnels :</strong> Pour mémoriser vos préférences</li>
    <li><strong>Cookies publicitaires :</strong> Pour personnaliser les publicités (avec votre consentement)</li>
</ul>

<h3>5.2 Gestion des cookies</h3>
<p>Vous pouvez à tout moment modifier vos préférences concernant les cookies via :</p>
<ul>
    <li>Les paramètres de votre navigateur internet</li>
    <li>Notre bandeau de gestion des cookies présent sur le site</li>
    <li>Les paramètres de votre compte utilisateur</li>
</ul>

<h2>6. Limitation de responsabilité</h2>
<p>{shop.name} s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur son site, mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.</p>

<p>En conséquence, {shop.name} décline toute responsabilité :</p>
<ul>
    <li>Pour les erreurs, inexactitudes ou omissions portant sur les informations du site</li>
    <li>Pour les dommages résultant d'une intrusion informatique ou de la présence de virus</li>
    <li>Pour les dysfonctionnements du site dus à des problèmes techniques</li>
</ul>

<h2>7. Droit applicable et juridiction compétente</h2>
<p>Les présentes mentions légales sont soumises au droit français. En cas de litige relatif à l'interprétation ou l'exécution des présentes, et à défaut de résolution amiable, les tribunaux français seront seuls compétents pour en connaître.</p>

<h2>8. Évolution des mentions légales</h2>
<p>{shop.name} se réserve le droit de modifier les présentes mentions légales à tout moment. Les modifications prennent effet dès leur publication sur le site. Il est recommandé de consulter régulièrement cette page.</p>

<h2>9. Contact</h2>
<div className="contact-info">
    <p>Pour toute question relative aux présentes mentions légales ou au fonctionnement du site, vous pouvez nous contacter :</p>
    <p><strong>Par email :</strong> <a href={`mailto:support@${shop.domain}`}>support@{shop.domain}</a></p>
    <p><strong>Par courrier :</strong><br/>
    {shop.name}<br/>
    125 RUE DE L'ARTISANAT<br/>
    42110 CIVENS</p>
</div>

<p><em>Dernière mise à jour : Juin 2025</em></p>


          </div>
        </section>
      </main>
      <Footer shop={shop} data={data} />
    </div>
  )
}


export async function getStaticProps() {
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID, show: true }, order: { id: 'desc' } });
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const reviews = await fetchData('reviews', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      shop: shop[0],
      brand: brand[0],
      categories: categories,
      data: data[0],
      reviews: reviews,
    },
  };
}