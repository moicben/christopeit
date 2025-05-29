// filepath: c:\Users\bendo\Desktop\Documents\Tech\Shop Template\automation\supabase\duplicateShop.mjs
import { supabase } from "../../lib/supabase.mjs";

async function duplicateShop(sourceShopId = 1, targetShopId) {
  if (!targetShopId) {
    console.error("Erreur: Vous devez spécifier un targetShopId");
    process.exit(1);
  }

  // Liste des tables à dupliquer (excluant "shops")
  const tables = ["contents", "products", "categories", "reviews", "brands", "posts"];

  for (const table of tables) {
    try {
      // 1. Récupérer toutes les données du shop source
      const { data: sourceData, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .eq('shop_id', sourceShopId);

      if (fetchError) {
        console.error(`Erreur lors de la récupération des données de la table "${table}": ${fetchError.message}`);
        continue;
      }

      if (!sourceData || sourceData.length === 0) {
        console.log(`Aucune donnée trouvée dans la table "${table}" pour shop_id = ${sourceShopId}`);
        continue;
      }

      console.log(`Récupération de ${sourceData.length} lignes depuis la table "${table}" pour shop_id = ${sourceShopId}`);

      // 2. Toujours supprimer les données existantes pour éviter les conflits
      console.log(`Suppression des données existantes dans "${table}" pour shop_id = ${targetShopId}...`);
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('shop_id', targetShopId);
      
      if (deleteError) {
        console.error(`Erreur lors de la suppression des données existantes dans "${table}": ${deleteError.message}`);
        // Continuer quand même, on essaiera d'insérer individuellement
      } else {
        console.log(`Données existantes supprimées de "${table}" pour shop_id = ${targetShopId}`);
      }
      
      // 3. Modifier les données pour le nouveau shop
      const newData = sourceData.map(item => {
        // Créer une copie de l'objet
        const newItem = { ...item };
        // Supprimer l'ID pour que Supabase en génère un nouveau
        delete newItem.id;
        // Modifier le shop_id
        newItem.shop_id = targetShopId;
        return newItem;
      });

      // Traiter les données par lots de 50 pour éviter les erreurs de taille de requête
      // Réduire la taille des lots pour les tables problématiques
      const batchSize = (table === "reviews" || table === "posts") ? 10 : 50;
      let successCount = 0;
      
      // Pour les tables "reviews" et "posts", on va directement insérer ligne par ligne
      if (table === "reviews" || table === "posts") {
        console.log(`Traitement spécial pour la table "${table}": insertion ligne par ligne...`);
        
        for (let i = 0; i < newData.length; i++) {
          try {
            const { error: singleInsertError } = await supabase
              .from(table)
              .insert([newData[i]]);
            
            if (!singleInsertError) {
              successCount++;
              
              // Afficher la progression tous les 20 éléments
              if (successCount % 20 === 0 || successCount === newData.length || successCount === 1) {
                console.log(`Progression pour "${table}": ${successCount}/${newData.length} lignes insérées`);
              }
            }
          } catch (itemError) {
            console.error(`Erreur lors de l'insertion de l'élément ${i+1} dans "${table}": ${itemError.message}`);
          }
        }
      } 
      // Pour les autres tables, on continue avec l'insertion par lots
      else {
        for (let i = 0; i < newData.length; i += batchSize) {
          const batch = newData.slice(i, i + batchSize);
          
          try {
            // 4. Insérer les données modifiées dans la même table
            const { error: insertError } = await supabase
              .from(table)
              .insert(batch);
            
            if (insertError) {
              console.error(`Erreur lors de l'insertion du lot ${Math.floor(i/batchSize) + 1} dans la table "${table}": ${insertError.message}`);
              
              // Si c'est un problème de clé primaire, insérer ligne par ligne
              if (insertError.message.includes("violates unique constraint") && batch.length > 1) {
                console.log(`Tentative d'insertion ligne par ligne pour le lot ${Math.floor(i/batchSize) + 1}...`);
                let individualSuccessCount = 0;
                
                for (const item of batch) {
                  try {
                    const { error: singleInsertError } = await supabase
                      .from(table)
                      .insert([item]);
                    
                    if (!singleInsertError) {
                      individualSuccessCount++;
                      successCount++;
                    }
                  } catch (itemError) {
                    // Ignorer les erreurs individuelles et continuer
                  }
                }
                
                console.log(`Insertion ligne par ligne: ${individualSuccessCount}/${batch.length} lignes insérées dans "${table}"`);
              }
            } else {
              successCount += batch.length;
              console.log(`Lot ${Math.floor(i/batchSize) + 1}: ${batch.length} lignes insérées dans "${table}"`);
            }
          } catch (batchError) {
            console.error(`Erreur inattendue lors de l'insertion du lot ${Math.floor(i/batchSize) + 1}: ${batchError.message}`);
          }
        }
      }

      console.log(`Duplication terminée pour "${table}": ${successCount}/${newData.length} lignes dupliquées pour shop_id = ${targetShopId}`);
    } catch (error) {
      console.error(`Erreur inattendue pour la table "${table}": ${error.message}`);
    }
  }

  console.log(`Duplication terminée: shop_id ${sourceShopId} -> shop_id ${targetShopId}`);
}

// Récupérer les arguments de la ligne de commande
const args = process.argv.slice(2);
const sourceShopId = parseInt(args[0]) || 1;
const targetShopId = parseInt(args[1]);

duplicateShop(sourceShopId, targetShopId);

/* 
Pour utiliser ce script:
node duplicateShop.mjs [sourceShopId] targetShopId

Exemples:
- Pour dupliquer shop_id 1 vers shop_id 2: 
  node duplicateShop.mjs 1 2
- Pour dupliquer shop_id 3 vers shop_id 4: 
  node duplicateShop.mjs 3 4
*/

