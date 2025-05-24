import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  'https://bpybtzxqypswjiizkzja.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweWJ0enhxeXBzd2ppaXpremphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDE1NjYsImV4cCI6MjA1ODExNzU2Nn0.08Uh9FjenwJ23unlZxyXDDDf4ZurGPjZai1cKBB6r9o'
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Enriches a column in a Supabase table by rewriting/improving its content via GPT-4.
 */
export async function enrichSupabaseColumn() {
  // 1) Fetch all rows where the target column is not null
  const { data: rows, error: fetchError } = await supabase
    .from('products')
    .select('*')
    //.eq('id', 69191) // Filtre pour ne cibler qu'un produit spécifique
    .in('category_id', [10, 11, 12]) // Filtre pour ne cibler que les catégories 10, 11, 12
    

  if (fetchError) throw fetchError

  for (const row of rows) {
    const userPrompt = `Améliore et enrichis la présentation détaillée du produit suivant pour une fiche produit e-commerce optimisée :\n
    - Titre du produit : ${row['title']}\n
    - Description actuelle : ${row['desc']}\n
    - Présentation actuelle à améliorer : ${row['more1']}\n
    \n
    Instructions :\n
    1. Structure la réponse au format HTML, adaptée pour une page produit e-commerce.\n
    2. Utilise des titres (h3, h4) et des paragraphes complets pour une lecture fluide et claire.\n
    3. Mets en avant les avantages, caractéristiques clés et points différenciants du produit.\n
    4. Adopte un ton professionnel et engageant, sans allusion à Décathlon ou à d'autres sites e-commerce.\n
    5. Ne réutilise pas les guillemets doubles ("") ou simples ('') inutiles dans les balises HTML.\n
    6. Fournis uniquement le contenu HTML de la présentation, sans texte ou balises supplémentaires.\n
    7. La présentation doit etre en 6 parties maximum, avec un maximum de 3 paragraphes par partie.\n
    8. N'inclut pas de balises <body>, <html> ou <head>.\n
    9. N'inclus pas le titre du produit dans la réponse.\n
    \n
    Voici la présentation enrichie :`

    try {
      // 2) Call GPT-4 to rewrite/improve
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Tu es un assistant de rédaction e-commerce' },
          { role: 'user',   content: userPrompt }
        ],
        max_tokens: 3000,
        temperature: 0.7
      })

      const enriched = completion.choices?.[0]?.message?.content?.trim()
        .replace(/<\/?(html|body)>/g, '') // Remove <html> and <body> tags
        .replace(/`/g, '') // Remove backticks
        .replace(/html/g, ''); // Remove html
      if (!enriched) continue

      // 3) Update the row in Supabase
      const { error: updateError } = await supabase
        .from('products')
        .update({ ['more1']: enriched })
        .eq('id', row.id)

      if (updateError) {
        console.error(`Failed to update row ${row.id}:`, updateError)
      } else {
        console.log(`Row ${row.id} enriched successfully.`)
        console.log(`Progress: ${((rows.indexOf(row) + 1) / rows.length * 100).toFixed(2)}%`)
      }
    } catch (err) {
      console.error(`Error enriching row ${row.id}:`, err)
    }
  }
}


// Example usage – wrap the call in an async IIFE and catch errors:
;(async () => {
  try {
    await enrichSupabaseColumn()
  } catch (err) {
    console.error('Error during enrichment:', err)
    process.exit(1)
  }
})()
