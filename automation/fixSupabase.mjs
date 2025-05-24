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
    return data;
}

// lance le fix
fixSupabase('reviews', { match: { shop_id: 1 } })
  .then(res => console.log(`Mis à jour ${res.length} reviews.`))
  .catch(err => console.error(err));