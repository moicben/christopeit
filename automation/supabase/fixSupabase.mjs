import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://bpybtzxqypswjiizkzja.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweWJ0enhxeXBzd2ppaXpremphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDE1NjYsImV4cCI6MjA1ODExNzU2Nn0.08Uh9FjenwJ23unlZxyXDDDf4ZurGPjZai1cKBB6r9o'

// Crée une instance unique du client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Récupère les données d'une table donnée, modifie le contenu pour la table "posts"
 * et met à jour les données modifiées dans Supabase.
 * @param {string} table - Le nom de la table à interroger (ex: "products", "categories", "reviews", "content").
 * @param {Object} [options] - Options supplémentaires pour la requête.
 * @returns {Promise<Object[]>} - Les données initialement récupérées.
 */
async function fixSupabase(table, options = {}) {
    const selectFields = '*';
    const matchQuery   = options.match || {};

    // On construit la query
    let query = supabase
        .from(table)
        .select(selectFields)
        .match(matchQuery);

    // Pour la table reviews, on ajoute un tri sur reviewDate puis experienceDate
    if (table === 'reviews') {
        // on ne conserve que les IDs entre 400 et 639
        query = query
            .order('reviewDate',    { ascending: true })
            .order('experienceDate',{ ascending: true })
            .gte('id', 400)
            .lte('id', 639);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    if (table === 'reviews' && data.length) {
        // pour chaque review, on remplace le dernier caractère par "4"
        await Promise.all(data.map(row => {
            const rd = String(row.reviewDate);
            const ed = String(row.experienceDate);
            return supabase
                .from('reviews')
                .update({
                    reviewDate:    rd.slice(0, -1) + '4',
                    experienceDate: ed.slice(0, -1) + '4'
                })
                .eq('id', row.id);
        }));
    }

    // Pour la table products avec shop_id 2, on met à jour les category_id
    if (table === 'products' && data.length) {
        const categoryMapping = {
            11: 47,  // category_id 11 → 47
            10: 43,  // category_id 10 → 43
            12: 48   // category_id 12 → 48
        };

        const productsToUpdate = data.filter(product => 
            product.shop_id === 2 && categoryMapping.hasOwnProperty(product.category_id)
        );

        console.log(`Produits à mettre à jour: ${productsToUpdate.length}`);

        await Promise.all(productsToUpdate.map(product => {
            const newCategoryId = categoryMapping[product.category_id];
            console.log(`Mise à jour produit ID ${product.id}: category_id ${product.category_id} → ${newCategoryId}`);
            
            return supabase
                .from('products')
                .update({ category_id: newCategoryId })
                .eq('id', product.id);
        }));
    }

    return data;
}

// lance le fix pour les produits avec shop_id 2
fixSupabase('products', { match: { shop_id: 2 } })
  .then(res => console.log(`Traité ${res.length} produits avec shop_id 2.`))
  .catch(err => console.error(err));