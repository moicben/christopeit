import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Assurez-vous d'avoir dotenv installé et configuré

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
    // On peut passer une sélection spécifique (ex: "id, title, description")
    const selectFields = options.select || '*';
    // On peut ajouter un filtre par match (ex: { id: 1 })
    const matchQuery = options.match || {};

    const { data, error } = await supabase
        .from(table)
        .select(selectFields)
        .match(matchQuery);

    if (error) {
        throw new Error(`Erreur lors de la récupération de ${table}: ${error.message}`);
    }

    // Pour la table "posts", remplace tous les "\n" dans "content" par "<br>"
    if (table === 'posts' && Array.isArray(data)) {
        // Met à jour chaque ligne récupérée
        const updatePromises = data.map(async (row) => {
            if (typeof row.content === 'string') {
                const updatedContent = row.content.replace(/`/g, '<br>');
                console.log('Row:', row); // Debugging
                console.log('Updated Content:', updatedContent); // Debugging

                // Met à jour la donnée dans Supabase
                const { error: updateError } = await supabase
                    .from(table)
                    .update({ content: updatedContent })
                    .match({ id: row.id }); // Suppose que le champ "id" identifie de manière unique la ligne

                if (updateError) {
                    console.error(`Erreur lors de la mise à jour de la ligne ${row.id}: ${updateError.message}`);
                }
            }
        });

        await Promise.all(updatePromises);
    }

    return data;
}

// Exécute la fonction pour la table "posts" avec un filtre sur shop_id
fixSupabase('posts', { match: { shop_id: process.env.SHOP_ID } });