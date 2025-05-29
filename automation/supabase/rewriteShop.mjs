import { supabase } from "../../lib/supabase.mjs";
import readline from 'readline';
import dotenv from 'dotenv';
dotenv.config(); // Charge les variables d'environnement depuis .env

// Configuration de l'API Claude (Anthropic)
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY; // À définir dans vos variables d'environnement
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Interface pour la saisie utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Demande une saisie utilisateur
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Appel à l'API Claude AI
 */
async function callClaudeAPI(prompt, content) {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY non définie dans les variables d\'environnement');
  }

  const requestBody = {
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `${prompt}\n\nContenu à réécrire:\n${content}`
      }
    ]
  };

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API Claude: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Erreur lors de l\'appel à Claude AI:', error.message);
    throw error;
  }
}

/**
 * Génère un prompt personnalisé pour la réécriture
 */
function generatePrompt(shopDescription, contentType, originalShop) {
  return `Tu es un expert en rédaction commerciale et marketing. Je veux que tu réécris le contenu suivant pour un nouveau shop.

INFORMATIONS SUR LE NOUVEAU SHOP:
${shopDescription}

SHOP ORIGINAL:
${originalShop}

TYPE DE CONTENU: ${contentType}

INSTRUCTIONS:
1. Adapte complètement le contenu au nouveau shop tout en gardant la structure et le ton professionnel
2. Remplace tous les noms de marques, produits et références spécifiques par ceux du nouveau shop
3. Conserve la longueur approximative du texte original
4. Garde le même niveau de détail et de persuasion
5. Assure-toi que le contenu soit cohérent avec l'identité du nouveau shop
6. Conserve le format HTML/Markdown si présent
7. Ne traduis pas, reste en français
8. Réponds uniquement avec le contenu réécrit, sans commentaires supplémentaires

IMPORTANT: Le contenu réécrit doit être prêt à être utilisé directement sans modification.`;
}

/**
 * Mise à jour du contenu pour singulariser un shop
 */
async function rewriteShop(targetShopId) {
  console.log('=== SCRIPT DE MISE À JOUR DE SHOP AVEC CLAUDE AI ===\n');

  // 1. Collecte des informations sur le nouveau shop
  console.log('📝 Analyse du nouveau shop')
  const shopName = 'Référence Haltères';
  const shopSector = 'Secteur d\'activité : sport, tech, musculation, haltèrophilie, etc.: ';
  const shopProducts = 'Types de produits vendus: haltères, kits et ensembles dhaltères, barres de musculation, etc.: '	;
  const shopTone = 'Ton souhaité : accessible, sportif, amical';

  const shopDescription = `
Nom: ${shopName}
Secteur: ${shopSector}
Produits: ${shopProducts}
Ton: ${shopTone}
  `.trim();

  console.log('\n🔍 Récupération des informations du shop cible...');

  // 2. Récupérer les informations du shop cible
  const { data: targetShop, error: shopError } = await supabase
    .from('shops')
    .select('*')
    .eq('id', targetShopId)
    .single();

  if (shopError || !targetShop) {
    console.error('Erreur: Shop cible introuvable');
    rl.close();
    return;
  }

  const originalShop = `Shop générique à personnaliser`;
  // 3. Traitement des contenus
  console.log('\n📄 Traitement des contenus...');
  
  const { data: contents, error: contentsError } = await supabase
    .from('contents')
    .select('*')
    .eq('shop_id', targetShopId);

  if (contentsError) {
    console.error('Erreur lors de la récupération des contenus:', contentsError.message);
    rl.close();
    return;
  }

  if (contents && contents.length > 0) {
    console.log(`📋 ${contents.length} contenus trouvés. Mise à jour en cours...`);

    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      console.log(`\n⚡ Traitement du contenu ${i + 1}/${contents.length}: ${content.page || content.id}`);

      try {
        // Vérifier quelle propriété contient le contenu principal
        let contentText = '';
        let updateData = {};
        
        // Rechercher la propriété qui contient le texte principal
        if (content.text && content.text.trim().length > 10) {
          contentText = content.text;
          const prompt = generatePrompt(shopDescription, `Page: ${content.page}`, originalShop);
          console.log('   🤖 Appel à Claude AI pour le texte...');
          const newText = await callClaudeAPI(prompt, content.text);
          updateData.text = newText;
          console.log('   ✅ Texte réécrit avec succès');
        }

        // Réécriture du titre si présent
        if (content.title && content.title.trim().length > 0) {
          const titlePrompt = generatePrompt(shopDescription, 'Titre de page', originalShop);
          console.log('   🤖 Réécriture du titre...');
          const newTitle = await callClaudeAPI(titlePrompt, content.title);
          updateData.title = newTitle;
          console.log('   ✅ Titre réécrit avec succès');
        }

        // Mettre à jour si nous avons des modifications
        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from('contents')
            .update(updateData)
            .eq('id', content.id);

          if (updateError) {
            console.error(`   ❌ Erreur lors de la mise à jour: ${updateError.message}`);
          } else {
            console.log('   💾 Contenu mis à jour en base');
          }
        } else {
          console.log('   ⏭️ Aucun contenu à mettre à jour');
        }

        // Petite pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`   ❌ Erreur lors du traitement: ${error.message}`);
      }
    }
  }
  // 4. Traitement des catégories
  console.log('\n📂 Traitement des catégories...');
  
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('shop_id', targetShopId);

  if (categoriesError) {
    console.error('Erreur lors de la récupération des catégories:', categoriesError.message);
  } else if (categories && categories.length > 0) {
    console.log(`📋 ${categories.length} catégories trouvées. Mise à jour en cours...`);

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      console.log(`\n⚡ Traitement de la catégorie ${i + 1}/${categories.length}: ${category.name}`);

      try {
        let updateData = {};

        // Réécriture du nom de catégorie
        if (category.name && category.name.trim().length > 0) {
          const namePrompt = generatePrompt(shopDescription, 'Nom de catégorie', originalShop);
          console.log('   🤖 Réécriture du nom...');
          const newName = await callClaudeAPI(namePrompt, category.name);
          updateData.name = newName;
          console.log('   ✅ Nom réécrit avec succès');
        }

        // Réécriture de la description si présente
        if (category.desc && category.desc.trim().length > 10) {
          const descPrompt = generatePrompt(shopDescription, 'Description de catégorie', originalShop);
          console.log('   🤖 Réécriture de la description...');
          const newDescription = await callClaudeAPI(descPrompt, category.desc);
          updateData.desc = newDescription;
          console.log('   ✅ Description réécrite avec succès');
        }

        // Mettre à jour si nous avons des modifications
        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from('categories')
            .update(updateData)
            .eq('id', category.id);

          if (updateError) {
            console.error(`   ❌ Erreur lors de la mise à jour: ${updateError.message}`);
          } else {
            console.log('   💾 Catégorie mise à jour en base');
          }
        } else {
          console.log('   ⏭️ Aucune modification nécessaire');
        }

        // Petite pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`   ❌ Erreur lors du traitement: ${error.message}`);
      }
    }
  }

  console.log(`\n🎉 Mise à jour terminée pour le shop "${shopName}"!`);
  console.log(`📊 Résumé: shop_id ${targetShopId} personnalisé avec succès`);
  
  rl.close();
}

// Récupérer les arguments de la ligne de commande
const args = process.argv.slice(2);
const targetShopId = parseInt(args[0]);

if (!targetShopId) {
  console.error('Usage: node rewriteShop.mjs <targetShopId>');
  console.error('Exemple: node rewriteShop.mjs 2');
  process.exit(1);
}

// Lancement du script
rewriteShop(targetShopId);

/* 
CONFIGURATION REQUISE:
1. Définir la variable d'environnement CLAUDE_API_KEY avec votre clé API Anthropic
2. Installer les dépendances: npm install

UTILISATION:
node rewriteShop.mjs <targetShopId>

Exemples:
- Pour mettre à jour le contenu du shop 2:
  node rewriteShop.mjs 2
- Pour mettre à jour le contenu du shop 3:
  node rewriteShop.mjs 3

Le script va automatiquement mettre à jour tous les contenus et catégories du shop avec les nouvelles informations définies dans le script.
*/
