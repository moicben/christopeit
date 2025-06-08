import React from 'react';
import Head from '../components/Head';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from 'lib/supabase.mjs';

const PolitiqueDeConfidentialite = ({shop, brand, categories, data, reviews}) => {
  return (
    <div className="container">
      <Head name={shop.name} domain={shop.domain} tag={shop.tag} pixel={shop.pixel}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.confidentialityPageLabel} - ${shop.name}`}
      />
      
      <main>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
    
        <section className='legal'> 
          <h1>{data.confidentialityPageLabel}</h1>
          <div>


          <div className="highlight-box">
    <p><strong>Engagement de confidentialité :</strong> {shop.name} s'engage à protéger votre vie privée et vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation française en vigueur.</p>
</div>

<p>Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons, stockons et protégeons vos données personnelles lorsque vous utilisez notre site web www.{shop.domain}.</p>

<h2>1. Responsable du traitement des données</h2>
<div className="data-table">
    <p><strong>Responsable du traitement :</strong> {shop.name} SAS</p>
    <p><strong>Représentée par :</strong> Véronique BERENGÈRE</p>
    <p><strong>Adresse :</strong> 125 RUE DE L'ARTISANAT, 42110 CIVENS</p>
    <p><strong>Email :</strong> <a href={`mailto:support@${shop.domain}`}>support@{shop.domain}</a></p>
</div>

<h2>2. Données personnelles collectées</h2>
<p>Nous collectons uniquement les données nécessaires au bon fonctionnement de notre service et à l'amélioration de votre expérience client.</p>

<h3>2.1 Données collectées directement</h3>
<table>
    <thead>
        <tr>
            <th>Type de données</th>
            <th>Exemples</th>
            <th>Finalité</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Informations d'identification</td>
            <td>Nom, prénom, date de naissance</td>
            <td>Gestion du compte client</td>
        </tr>
        <tr>
            <td>Coordonnées</td>
            <td>Adresse email, adresse postale, téléphone</td>
            <td>Communication et livraison</td>
        </tr>
        <tr>
            <td>Informations de paiement</td>
            <td>Données bancaires (cryptées)</td>
            <td>Traitement des commandes</td>
        </tr>
        <tr>
            <td>Historique d'achat</td>
            <td>Commandes, préférences produits</td>
            <td>Service client et personnalisation</td>
        </tr>
    </tbody>
</table>

<h3>2.2 Données collectées automatiquement</h3>
<ul>
    <li><strong>Données de navigation :</strong> Pages visitées, temps de visite, parcours sur le site</li>
    <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, système d'exploitation</li>
    <li><strong>Cookies et traceurs :</strong> Préférences utilisateur, données analytiques</li>
    <li><strong>Données de géolocalisation :</strong> Ville et pays (données approximatives)</li>
</ul>

<h2>3. Base légale et consentement</h2>
<div className="important">
    <p><strong>Principe de consentement :</strong> En utilisant notre site et en créant un compte, vous consentez expressément au traitement de vos données personnelles selon les modalités décrites dans cette politique.</p>
</div>

<p>Le traitement de vos données repose sur plusieurs bases légales :</p>
<ul>
    <li><strong>Consentement :</strong> Pour les communications marketing et les cookies non essentiels</li>
    <li><strong>Exécution du contrat :</strong> Pour le traitement des commandes et la livraison</li>
    <li><strong>Intérêt légitime :</strong> Pour l'amélioration de nos services et la sécurité</li>
    <li><strong>Obligation légale :</strong> Pour la comptabilité et les obligations fiscales</li>
</ul>

<h2>4. Utilisation des données personnelles</h2>
<p>Vos données personnelles sont utilisées exclusivement pour les finalités suivantes :</p>

<h3>4.1 Gestion commerciale</h3>
<ul>
    <li>Traitement et suivi de vos commandes</li>
    <li>Gestion des livraisons et retours</li>
    <li>Facturation et gestion comptable</li>
    <li>Service après-vente et support client</li>
</ul>

<h3>4.2 Amélioration de nos services</h3>
<ul>
    <li>Personnalisation de votre expérience de navigation</li>
    <li>Analyse statistique et amélioration du site</li>
    <li>Développement de nouveaux produits et services</li>
    <li>Détection et prévention de la fraude</li>
</ul>

<h3>4.3 Communication marketing (avec consentement)</h3>
<ul>
    <li>Envoi de newsletters et offres promotionnelles</li>
    <li>Information sur nos nouveaux produits</li>
    <li>Enquêtes de satisfaction client</li>
    <li>Programme de fidélité et récompenses</li>
</ul>

<h2>5. Partage et transfert des données</h2>
<p>Nous ne vendons jamais vos données personnelles à des tiers. Cependant, nous pouvons partager certaines informations avec nos partenaires de confiance dans les cas suivants :</p>

<h3>5.1 Prestataires de services</h3>
<ul>
    <li><strong>Hébergement :</strong> Hostinger (stockage sécurisé des données)</li>
    <li><strong>Paiement :</strong> Stripe (traitement sécurisé des transactions)</li>
    <li><strong>Livraison :</strong> Transporteurs partenaires (Colissimo, Chronopost, etc.)</li>
    <li><strong>Marketing :</strong> Plateformes d'emailing (avec votre consentement)</li>
    <li><strong>Analyse :</strong> Outils statistiques (Google Analytics, etc.)</li>
</ul>

<h3>5.2 Obligations légales</h3>
<p>Nous pouvons être amenés à communiquer vos données aux autorités compétentes dans les cas suivants :</p>
<ul>
    <li>Réquisition judiciaire ou administrative</li>
    <li>Lutte contre la fraude et les activités illégales</li>
    <li>Protection de nos droits et de notre sécurité</li>
    <li>Respect des obligations comptables et fiscales</li>
</ul>

<h3>5.3 Transferts internationaux</h3>
<p>Certains de nos prestataires peuvent être situés en dehors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont mises en place (clauses contractuelles types, certification Privacy Shield, etc.) pour protéger vos données.</p>

<h2>6. Sécurité et protection des données</h2>
<div className="highlight-box">
    <p><strong>Engagement sécuritaire :</strong> Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.</p>
</div>

<h3>6.1 Mesures techniques</h3>
<ul>
    <li>Chiffrement des données sensibles (SSL/TLS)</li>
    <li>Authentification sécurisée et mots de passe complexes</li>
    <li>Sauvegarde régulière et sécurisée des données</li>
    <li>Mise à jour régulière des systèmes de sécurité</li>
    <li>Surveillance continue des accès et activités suspectes</li>
</ul>

<h3>6.2 Mesures organisationnelles</h3>
<ul>
    <li>Formation du personnel aux règles de confidentialité</li>
    <li>Accès aux données limité selon le principe du besoin d'en connaître</li>
    <li>Procédures de gestion des incidents de sécurité</li>
    <li>Audits réguliers de nos pratiques de sécurité</li>
</ul>

<h2>7. Durée de conservation des données</h2>
<p>Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :</p>

<table>
    <thead>
        <tr>
            <th>Type de données</th>
            <th>Durée de conservation</th>
            <th>Base légale</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Données de compte client</td>
            <td>3 ans après la dernière activité</td>
            <td>Relation commerciale</td>
        </tr>
        <tr>
            <td>Historique des commandes</td>
            <td>10 ans</td>
            <td>Obligations comptables</td>
        </tr>
        <tr>
            <td>Données de paiement</td>
            <td>13 mois maximum</td>
            <td>Lutte contre la fraude</td>
        </tr>
        <tr>
            <td>Cookies analytiques</td>
            <td>25 mois maximum</td>
            <td>Amélioration du service</td>
        </tr>
        <tr>
            <td>Données marketing</td>
            <td>3 ans ou jusqu'au retrait du consentement</td>
            <td>Consentement</td>
        </tr>
    </tbody>
</table>

<h2>8. Vos droits sur vos données personnelles</h2>
<p>Conformément au RGPD, vous disposez des droits suivants que vous pouvez exercer à tout moment :</p>

<h3>8.1 Droit d'accès</h3>
<p>Vous avez le droit d'obtenir la confirmation que vos données sont traitées et d'accéder à ces données ainsi qu'à certaines informations sur leur traitement.</p>

<h3>8.2 Droit de rectification</h3>
<p>Vous pouvez demander la correction de données inexactes ou incomplètes vous concernant.</p>

<h3>8.3 Droit à l'effacement ("droit à l'oubli")</h3>
<p>Vous pouvez demander l'effacement de vos données dans certaines circonstances (retrait du consentement, données non nécessaires, etc.).</p>

<h3>8.4 Droit à la limitation du traitement</h3>
<p>Vous pouvez demander la limitation du traitement de vos données dans certains cas.</p>

<h3>8.5 Droit à la portabilité</h3>
<p>Vous avez le droit de recevoir vos données dans un format structuré et de les transmettre à un autre responsable de traitement.</p>

<h3>8.6 Droit d'opposition</h3>
<p>Vous pouvez vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière ou pour des finalités de marketing direct.</p>

<h3>8.7 Droit de retirer votre consentement</h3>
<p>Lorsque le traitement est basé sur votre consentement, vous pouvez le retirer à tout moment.</p>

<div className="important">
    <p><strong>Comment exercer vos droits :</strong> Pour exercer l'un de ces droits, contactez-nous à l'adresse <a href={`mailto:support@${shop.domain}`}>support@{shop.domain}</a> en précisant votre demande et en joignant une copie de votre pièce d'identité. Nous vous répondrons dans un délai maximum d'un mois.</p>
</div>

<h2>9. Cookies et technologies similaires</h2>
<p>Notre site utilise différents types de cookies pour améliorer votre expérience et analyser l'utilisation du site.</p>

<h3>9.1 Types de cookies utilisés</h3>
<ul>
    <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (panier, connexion)</li>
    <li><strong>Cookies de performance :</strong> Mesure d'audience et statistiques de visite</li>
    <li><strong>Cookies fonctionnels :</strong> Mémorisation de vos préférences</li>
    <li><strong>Cookies publicitaires :</strong> Personnalisation des publicités (avec consentement)</li>
</ul>

<h3>9.2 Gestion de vos préférences</h3>
<p>Vous pouvez gérer vos préférences concernant les cookies :</p>
<ul>
    <li>Via notre bandeau de gestion des cookies</li>
    <li>Dans les paramètres de votre navigateur</li>
    <li>En nous contactant directement</li>
</ul>

<h2>10. Droits spécifiques aux mineurs</h2>
<p>Notre site et nos services ne sont pas destinés aux personnes de moins de 16 ans. Si nous apprenons qu'un mineur nous a fourni des données personnelles, nous les supprimerons immédiatement. Si vous êtes parent ou tuteur et que vous pensez que votre enfant nous a fourni des données personnelles, contactez-nous.</p>

<h2>11. Modifications de la politique de confidentialité</h2>
<p>Nous pouvons être amenés à modifier cette politique de confidentialité pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. Toute modification sera publiée sur cette page avec une date de mise à jour. Les modifications importantes vous seront notifiées par email.</p>

<h2>12. Réclamations et contact</h2>
<div className="data-table">
    <h3>12.1 Contact pour vos données personnelles</h3>
    <p><strong>Email :</strong> <a href={`mailto:support@${shop.domain}`}>support@{shop.domain}</a></p>
    <p><strong>Objet :</strong> Précisez "Données personnelles - [votre demande]"</p>
    <p><strong>Courrier :</strong><br/>
    {shop.name} - Service Protection des Données<br/>
    125 RUE DE L'ARTISANAT<br/>
    42110 CIVENS</p>
</div>

<h3>12.2 Droit de réclamation</h3>
<p>Si vous estimez que le traitement de vos données personnelles constitue une violation de la réglementation applicable, vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente :</p>

<p><strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong><br/>
3 Place de Fontenoy - TSA 80715<br/>
75334 PARIS CEDEX 07<br/>
Téléphone : 01 53 73 22 22<br/>
Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>

<h2>13. Définitions</h2>
<ul>
    <li><strong>Données personnelles :</strong> Toute information se rapportant à une personne physique identifiée ou identifiable</li>
    <li><strong>Traitement :</strong> Toute opération effectuée sur des données personnelles (collecte, utilisation, stockage, etc.)</li>
    <li><strong>Responsable de traitement :</strong> Entité qui détermine les finalités et les moyens du traitement</li>
    <li><strong>Sous-traitant :</strong> Entité qui traite des données pour le compte du responsable de traitement</li>
</ul>

<p><em>Dernière mise à jour : Juin 2025</em></p>
<p><em>Version 2.1</em></p>

          </div>
        </section>
      </main>
      <Footer shop={shop} data={data} />
    </div>
  );
};

export default PolitiqueDeConfidentialite;

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