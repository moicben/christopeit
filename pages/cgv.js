
import React from 'react';
import Head from '../components/Head';
import { FaShoppingCart } from 'react-icons/fa';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from 'lib/supabase.mjs';

export default function ConditionsGenerales({shop, brand, categories, data, reviews}) {
  return (
    <div className="container">
      <Head name={shop.name} domain={shop.domain} tag={shop.tag} pixel={shop.pixel}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.cgvPageLabel} - ${shop.name}`}
      />

      <main>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
        
        <section className='legal'>
          <h1>{data.cgvPageLabel}</h1>
          <div>
          <h2>1. Présentation de l'entreprise</h2>
<div class="company-info">
    <p><strong>Site web :</strong> www.{shop.domain}</p>
    <p><strong>Société :</strong> {shop.name} SAS</p>
    <p><strong>Numéro d'immatriculation :</strong> 851 990 135</p>
    <p><strong>Numéro de SIRET :</strong> 85199013500028</p>
    <p><strong>Adresse du siège social :</strong> 125 RUE DE L'ARTISANAT, 42110 CIVENS</p>
    <p><strong>Responsable légal :</strong> Véronique BERENGÈRE</p>
    <p><strong>Contact :</strong> <a href="mailto:support@{shop.domain}">support@{shop.domain}</a></p>
</div>

<h2>2. Champ d'application</h2>
<p>Les présentes Conditions Générales de Vente (CGV) régissent exclusivement les relations contractuelles entre la société {shop.name} et tout client souhaitant effectuer un achat sur le site www.{shop.domain}. Toute passation de commande implique l'acceptation pleine et entière des présentes conditions générales de vente, sans restriction ni réserve.</p>

<h2>3. Produits et services</h2>
<p>Notre boutique en ligne propose une gamme complète de produits et accessoires destinés aux lapins domestiques. Les produits sont présentés avec des descriptions, photographies et caractéristiques techniques à titre indicatif. Bien que nous mettions tout en œuvre pour assurer l'exactitude des informations, de légers écarts peuvent exister entre la présentation en ligne et le produit réellement livré, notamment concernant les couleurs qui peuvent varier selon votre écran.</p>

<h2>4. Prix et conditions tarifaires</h2>
<p>Tous les prix affichés sur notre site sont exprimés en euros (€) et incluent la TVA au taux en vigueur. Les frais de port et de livraison sont clairement indiqués et ajoutés au montant total avant la validation définitive de votre commande. Les tarifs applicables sont ceux en vigueur au moment de la validation de la commande. {shop.name} se réserve le droit de modifier ses prix à tout moment, étant entendu que les produits seront facturés sur la base des tarifs en vigueur au moment de l'enregistrement des commandes.</p>

<h2>5. Processus de commande</h2>
<p>Pour effectuer une commande sur notre site, veuillez suivre les étapes suivantes :</p>
<ul>
    <li><strong>Sélection :</strong> Parcourez notre catalogue et ajoutez les produits souhaités à votre panier</li>
    <li><strong>Vérification :</strong> Consultez le contenu de votre panier et modifiez si nécessaire</li>
    <li><strong>Identification :</strong> Créez votre compte client ou connectez-vous</li>
    <li><strong>Livraison :</strong> Renseignez vos coordonnées de livraison et de facturation</li>
    <li><strong>Validation :</strong> Acceptez les présentes CGV et confirmez votre commande</li>
</ul>
<p>Une confirmation de commande vous sera automatiquement adressée par email. {shop.name} se réserve le droit d'annuler toute commande présentant un caractère frauduleux ou suspect, ou émanant d'un client avec lequel existerait un litige.</p>

<h2>6. Modalités de paiement</h2>
<p>Le paiement de vos commandes s'effectue exclusivement par voie électronique via notre plateforme sécurisée Stripe. Les moyens de paiement acceptés sont :</p>
<ul>
    <li>Cartes bancaires (Visa, Mastercard, American Express)</li>
    <li>Virement bancaire (sur conditions et validation préalable)</li>
</ul>
<p>Toutes les transactions sont sécurisées et cryptées. Les données bancaires ne sont ni conservées ni stockées sur nos serveurs.</p>

<h2>7. Livraison</h2>

<h3>7.1 Délais de livraison</h3>
<p>Les commandes sont préparées et expédiées sous 2 à 5 jours ouvrés suivant la validation du paiement. Les délais de livraison varient selon le transporteur choisi et sont communiqués à titre indicatif lors de la commande.</p>

<h3>7.2 Zones de livraison</h3>
<p>Nous livrons exclusivement en France métropolitaine. Pour toute demande de livraison vers les DOM-TOM ou l'étranger, nous vous invitons à nous contacter préalablement à l'adresse support@{shop.domain} pour étudier les modalités et coûts spécifiques.</p>

<h3>7.3 Réception de la commande</h3>
<p>Il appartient au client de vérifier l'état de sa commande à la réception et de signaler toute anomalie (colis endommagé, produits manquants) dans les 48 heures suivant la livraison.</p>

<h2>8. Politique de retours et remboursements</h2>
<div class="important">
    <p><strong>Satisfaction garantie :</strong> Nous nous engageons à votre entière satisfaction. Si un produit ne vous convient pas, nous acceptons les retours sous certaines conditions.</p>
</div>

<h3>8.1 Conditions de retour</h3>
<p>Les articles peuvent être retournés s'ils respectent l'ensemble des conditions suivantes :</p>
<ul>
    <li>Retour effectué dans les <strong>60 jours</strong> suivant la réception</li>
    <li>Articles dans leur état d'origine, non utilisés et non endommagés</li>
    <li>Emballage d'origine et accessoires complets</li>
    <li>Facture d'achat jointe</li>
</ul>

<h3>8.2 Processus de retour</h3>
<p>Pour initier un retour, veuillez suivre la procédure suivante :</p>
<ol>
    <li>Contactez notre service client : <a href="mailto:support@{shop.domain}">support@{shop.domain}</a></li>
    <li>Précisez votre numéro de commande et le motif du retour</li>
    <li>Suivez les instructions de retour qui vous seront communiquées</li>
    <li>Retournez le produit selon les modalités indiquées</li>
</ol>

<h3>8.3 Traitement des remboursements</h3>
<p>Après réception et contrôle de l'article retourné, nous vous informerons par email de l'acceptation ou du refus de votre demande de remboursement. En cas d'acceptation, le remboursement sera effectué sur votre moyen de paiement initial sous 7 à 14 jours ouvrés.</p>

<h3>8.4 Échanges</h3>
<p>Nous ne proposons pas d'échange direct. Pour obtenir un article différent, veuillez procéder au retour de l'article initial et passer une nouvelle commande pour le produit souhaité.</p>

<h3>8.5 Articles non retournables</h3>
<p>Certaines catégories d'articles ne peuvent faire l'objet d'un retour :</p>
<ul>
    <li>Cartes cadeaux et bons d'achat</li>
    <li>Articles soldés ou en promotion</li>
    <li>Produits personnalisés ou sur-mesure</li>
    <li>Articles d'hygiène pour des raisons sanitaires</li>
</ul>

<h2>9. Garanties et responsabilité</h2>
<p>Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés. En cas de défaut de conformité, le client peut exiger la réparation ou le remplacement du bien ou, à défaut, la restitution du prix.</p>

<h2>10. Protection des données personnelles</h2>
<p>Conformément au Règlement Général sur la Protection des Données (RGPD), nous nous engageons à protéger vos données personnelles. Pour plus d'informations, consultez notre politique de confidentialité.</p>

<h2>11. Droit applicable et juridiction</h2>
<p>Les présentes conditions générales de vente sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.</p>

<h2>12. Contact</h2>
<p>Pour toute question concernant ces conditions générales de vente ou nos services, n'hésitez pas à nous contacter :</p>
<ul>
    <li><strong>Email :</strong> <a href="mailto:support@{shop.domain}">support@{shop.domain}</a></li>
    <li><strong>Adresse :</strong> {shop.name}, 125 RUE DE L'ARTISANAT, 42110 CIVENS</li>
</ul>

<p><em>Dernière mise à jour : Mars 2025</em></p>
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