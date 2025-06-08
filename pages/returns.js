import React from 'react';
import Head from '../components/Head';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from 'lib/supabase.mjs';


const PolitiqueDesRetours = ({shop, brand, categories, data, reviews}) => {
  return (

    <div className="container">
      <Head name={shop.name} domain={shop.domain} tag={shop.tag} pixel={shop.pixel}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.returnsPageLabel} - ${shop.name}`}
      />
      
      <main >
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />

    
      <section className='legal'> 
        <h1>{data.returnsPageLabel}</h1>
        <div>
   

        <div className="satisfaction-box">
    <h2>🐰 Votre satisfaction, notre priorité !</h2>
    <p>Chez {shop.name}, nous nous engageons à vous offrir des produits de qualité pour vos compagnons à quatre pattes. Si pour une raison quelconque vous n'êtes pas entièrement satisfait de votre achat, nous acceptons les retours sous certaines conditions détaillées ci-dessous.</p>
</div>

<h2>1. Conditions générales de retour</h2>
<p>Pour que votre retour soit accepté, les articles doivent respecter l'ensemble des conditions suivantes :</p>

<div className="important">
    <h3>1.1 Délai de retour</h3>
    <p><strong>60 jours calendaires</strong> à compter de la date de réception de votre commande. Ce délai généreux vous permet de tester nos produits avec vos lapins et de vous assurer qu'ils conviennent parfaitement.</p>
</div>

<h3>1.2 État des articles</h3>
<ul>
    <li><strong>État neuf et inutilisé :</strong> Les produits doivent être dans leur état d'origine, non utilisés et non endommagés</li>
    <li><strong>Emballage complet :</strong> Retour avec l'emballage d'origine, étiquettes et notice d'utilisation</li>
    <li><strong>Accessoires inclus :</strong> Tous les accessoires et composants doivent être présents</li>
    <li><strong>Hygiène :</strong> Les articles en contact direct avec les animaux doivent être dans un état d'hygiène parfait</li>
</ul>

<h3>1.3 Documentation requise</h3>
<ul>
    <li>Facture d'achat ou preuve d'achat</li>
    <li>Numéro de commande</li>
    <li>Formulaire de retour (fourni avec votre commande ou téléchargeable)</li>
</ul>

<h2>2. Processus de retour étape par étape</h2>
<p>Pour vous faciliter la démarche, voici la procédure simple à suivre :</p>

<div className="process-step">
    <h3>Étape 1 : Contactez notre service client</h3>
    <p><strong>Email :</strong> <a href={`mailto:support@${shop.domain}`}>support@{shop.domain}</a></p>
    <p><strong>Objet du mail :</strong> "Demande de retour - Commande #[votre numéro]"</p>
    <p><strong>Informations à inclure :</strong></p>
    <ul>
        <li>Numéro de commande</li>
        <li>Article(s) concerné(s)</li>
        <li>Motif du retour (défaut, non-conformité, changement d'avis, etc.)</li>
        <li>Photos si défaut constaté</li>
    </ul>
</div>

<div className="process-step">
    <h3>Étape 2 : Réception des instructions</h3>
    <p>Notre équipe vous répondra sous <strong>24-48 heures</strong> avec :</p>
    <ul>
        <li>Confirmation de l'acceptation de votre demande</li>
        <li>Étiquette de retour prépayée (si éligible)</li>
        <li>Instructions détaillées d'emballage</li>
        <li>Numéro de retour (RMA) à reporter sur le colis</li>
    </ul>
</div>

<div className="process-step">
    <h3>Étape 3 : Préparation et expédition</h3>
    <p>Préparez votre colis en suivant nos instructions :</p>
    <ul>
        <li>Emballez soigneusement les articles</li>
        <li>Insérez la facture et le formulaire de retour</li>
        <li>Collez l'étiquette de retour sur le colis</li>
        <li>Déposez le colis chez notre transporteur partenaire</li>
    </ul>
</div>

<div className="process-step">
    <h3>Étape 4 : Suivi et traitement</h3>
    <p>Une fois votre retour expédié :</p>
    <ul>
        <li>Vous recevrez un email de confirmation de prise en charge</li>
        <li>Suivi en temps réel de votre colis retour</li>
        <li>Inspection de votre retour à réception dans nos entrepôts</li>
        <li>Notification du traitement de votre retour</li>
    </ul>
</div>

<h2>3. Remboursements</h2>
<div className="timeline">
    <h3>3.1 Délai de traitement</h3>
    <p><strong>Inspection :</strong> 2-3 jours ouvrés après réception<br/>
    <strong>Validation :</strong> Notification par email de l'acceptation ou du refus<br/>
    <strong>Remboursement :</strong> 5-10 jours ouvrés après validation</p>
</div>

<h3>3.2 Modalités de remboursement</h3>
<ul>
    <li><strong>Méthode :</strong> Remboursement sur votre moyen de paiement initial</li>
    <li><strong>Montant :</strong> Prix des articles + taxes (frais de port initial non remboursés sauf défaut produit)</li>
    <li><strong>Frais de retour :</strong> À votre charge sauf en cas de défaut ou d'erreur de notre part</li>
</ul>

<h3>3.3 Remboursement accéléré</h3>
<p>Pour les clients fidèles et les retours simples, nous proposons un remboursement immédiat dès expédition de votre retour (sous conditions).</p>

<h2>4. Échanges</h2>
<p>Bien que nous ne proposions pas d'échange direct, vous pouvez :</p>
<ol>
    <li>Effectuer un retour selon la procédure ci-dessus</li>
    <li>Passer une nouvelle commande pour l'article souhaité</li>
    <li><strong>Avantage :</strong> Bénéficiez de la livraison gratuite sur votre nouvelle commande si l'échange est dû à une erreur de notre part</li>
</ol>

<div className="important">
    <p><strong>Conseil :</strong> Pour un échange plus rapide, vous pouvez passer votre nouvelle commande avant de retourner l'article initial. Vous serez remboursé dès réception et validation de votre retour.</p>
</div>

<h2>5. Articles non retournables</h2>
<div className="warning-box">
    <p><strong>Attention :</strong> Certaines catégories d'articles ne peuvent pas être retournées pour des raisons d'hygiène, de sécurité ou de personnalisation :</p>
</div>

<ul>
    <li><strong>Articles d'hygiène :</strong> Produits de soins corporels ouverts, compléments alimentaires entamés</li>
    <li><strong>Alimentation :</strong> Produits alimentaires ouverts ou dont la date limite est proche</li>
    <li><strong>Articles personnalisés :</strong> Produits gravés, brodés ou fabriqués sur-mesure</li>
    <li><strong>Cartes cadeaux :</strong> Bons d'achat et cartes cadeaux (sauf défaut technique)</li>
    <li><strong>Promotions spéciales :</strong> Articles soldés de plus de 50% (sauf défaut produit)</li>
    <li><strong>Plantes vivantes :</strong> Végétaux et produits périssables</li>
</ul>

<h2>6. Cas particuliers</h2>

<h3>6.1 Produit défectueux ou non-conforme</h3>
<p>En cas de défaut de fabrication ou de non-conformité :</p>
<ul>
    <li><strong>Retour gratuit :</strong> Frais de retour pris en charge par {shop.name}</li>
    <li><strong>Remboursement complet :</strong> Article + frais de port aller et retour</li>
    <li><strong>Délai prioritaire :</strong> Traitement en 24-48h</li>
    <li><strong>Dédommagement :</strong> Possibilité de geste commercial selon le préjudice</li>
</ul>

<h3>6.2 Erreur de livraison</h3>
<p>Si vous recevez un article différent de votre commande :</p>
<ul>
    <li>Contactez-nous immédiatement avec photos</li>
    <li>Conservez l'article reçu par erreur</li>
    <li>Nous organisons la récupération et la livraison du bon produit</li>
    <li>Aucun frais à votre charge</li>
</ul>

<h3>6.3 Colis endommagé</h3>
<p>En cas de réception d'un colis endommagé :</p>
<ol>
    <li>Prenez des photos du colis et du contenu</li>
    <li>Émettez des réserves auprès du transporteur</li>
    <li>Contactez-nous sous 48h avec les photos</li>
    <li>Nous traiterons votre dossier en priorité</li>
</ol>

<h2>7. Garanties légales</h2>
<p>Indépendamment de notre politique de retour, vous bénéficiez des garanties légales :</p>
<ul>
    <li><strong>Garantie de conformité :</strong> 2 ans à compter de la livraison</li>
    <li><strong>Garantie contre les vices cachés :</strong> Selon les dispositions légales</li>
    <li><strong>Garantie constructeur :</strong> Selon les conditions du fabricant</li>
</ul>

<h2>8. Frais de retour</h2>

<table style={{width: "100%", borderCollapse: "collapse", margin: "20px 0"}}>
    <thead>
        <tr style={{backgroundColor: "#f8f9fa"}}>
            <th style={{border: "1px solid #ddd", padding: "10px"}}>Situation</th>
            <th style={{border: "1px solid #ddd", padding: "10px"}}>Frais de retour</th>
            <th style={{border: "1px solid #ddd", padding: "10px"}}>Frais de port initial</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Changement d'avis</td>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>À votre charge</td>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Non remboursé</td>
        </tr>
        <tr>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Produit défectueux</td>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Gratuit</td>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Remboursé</td>
        </tr>
        <tr>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Erreur de notre part</td>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Gratuit</td>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Remboursé</td>
        </tr>
        <tr>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Article non-conforme</td>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Gratuit</td>
            <td style={{border: "1px solid #ddd", padding: "10px"}}>Remboursé</td>
        </tr>
    </tbody>
</table>

<h2>9. Conseils pour un retour réussi</h2>
<div className="important">
    <h3>✅ Bonnes pratiques :</h3>
    <ul>
        <li>Testez les produits rapidement après réception</li>
        <li>Conservez tous les emballages pendant 60 jours</li>
        <li>Prenez des photos avant retour en cas de défaut</li>
        <li>Utilisez un transporteur avec suivi</li>
        <li>Gardez une preuve d'expédition</li>
    </ul>
</div>

<h2>10. Service client et assistance</h2>
<div className="contact-highlight">
    <h3>🎧 Notre équipe est là pour vous aider !</h3>
    <p><strong>Email :</strong> <a href={`mailto:support@${shop.domain}`}>support@{shop.domain}</a></p>
    <p><strong>Horaires :</strong> Lundi au Vendredi, 9h-18h</p>
    <p><strong>Délai de réponse :</strong> Moins de 24h en moyenne</p>
    <p><strong>Téléphone :</strong> {shop.phone}</p>
</div>

        </div>
      </section>
      </main>
      <Footer shop={shop} data={data} />
    </div>
  );
};

export default PolitiqueDesRetours;


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
