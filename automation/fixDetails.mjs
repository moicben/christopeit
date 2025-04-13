// lib/supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Assurez-vous d'avoir dotenv installé et configuré

const supabaseUrl = 'https://bpybtzxqypswjiizkzja.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweWJ0enhxeXBzd2ppaXpremphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDE1NjYsImV4cCI6MjA1ODExNzU2Nn0.08Uh9FjenwJ23unlZxyXDDDf4ZurGPjZai1cKBB6r9o'

// Crée une instance unique du client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Récupère les données d'une table donnée avec des options de requête.
 * @param {string} table - Le nom de la table à interroger (ex: "products", "categories", "reviews", "content").
 * @param {Object} [options] - Options supplémentaires pour la requête.
 * @returns {Promise<Object[]>} - Les données récupérées.
 */
export async function fetchData(table, options = {}) {
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

    // Pour la table "reviews", remplace tous les "\n" dans "content" par "<br>"
    if (table === 'reviews' && Array.isArray(data)) {
        data.forEach(row => {
            if (typeof row.content === 'string') {
                row.content = row.content.replace(/Très satisfait de la commande et du service en rapidité merci à vouss/g, '<br>');
            }
        });
    }

    return data;
}
