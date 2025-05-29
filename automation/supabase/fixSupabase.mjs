import { supabase } from '../../lib/supabase.mjs';

/**
 * Met à jour la colonne "order" de la table reviews
 * pour trier les avis du plus récent au plus vieux basé sur reviewDate
 */
async function fixReviewsOrder() {
  try {
    console.log('🔄 Récupération des avis depuis Supabase...');
    
    // Récupérer tous les avis avec leur reviewDate
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('id, reviewDate')
      .eq('shop_id', 1) // Remplacer par l'ID de la boutique si nécessaire
      .not('reviewDate', 'is', null);

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération des avis:', fetchError.message);
      return;
    }

    if (!reviews || reviews.length === 0) {
      console.log('⚠️ Aucun avis trouvé avec une reviewDate valide');
      return;
    }

    console.log(`📊 ${reviews.length} avis récupérés`);

    // Trier les avis par date (plus récent au plus vieux)
    // Même logique que dans ReviewsBadge.js
    const sortedReviews = reviews
      .filter(review => review.reviewDate) // S'assurer que reviewDate existe
      .sort((a, b) => {
        // Convertir les dates string DD/MM/YYYY en objets Date pour le tri
        const dateA = new Date(a.reviewDate.split('/').reverse().join('/'));
        const dateB = new Date(b.reviewDate.split('/').reverse().join('/'));
        return dateB - dateA; // tri par date décroissante (plus récent d'abord)
      });

    console.log('🔄 Mise à jour de l\'ordre des avis...');

    // Mettre à jour chaque avis avec son nouvel ordre
    for (let i = 0; i < sortedReviews.length; i++) {
      const review = sortedReviews[i];
      const newOrder = i + 1; // L'ordre commence à 1 (plus récent = 1)

      const { error: updateError } = await supabase
        .from('reviews')
        .update({ order: newOrder })
        .eq('id', review.id);

      if (updateError) {
        console.error(`❌ Erreur lors de la mise à jour de l'avis ${review.id}:`, updateError.message);
      } else {
        // Afficher la progression tous les 10 avis
        if ((i + 1) % 10 === 0 || i === sortedReviews.length - 1) {
          console.log(`✅ Progression: ${i + 1}/${sortedReviews.length} avis mis à jour`);
        }
      }
    }

    console.log('🎉 Mise à jour de l\'ordre des avis terminée !');
    console.log(`📈 ${sortedReviews.length} avis ont été réordonnés du plus récent au plus vieux`);

  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message);
  }
}

// Exécuter le script
fixReviewsOrder();