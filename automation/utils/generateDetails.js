export async function generateDetails(productdData) {
  try {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'Tu es un assistant français spécialisé e-commerce' },
            { role: 'user', content: `pour le titre de produit suivant rédige un slug produit et unique : ${title}\n
            Réponds uniquement avec le slug produit, rien d'autre.
            Voici le slug produit rédigé :
            `}
        ],
        max_tokens: 2000
    });

    return response.choices[0].message.content.trim();

  } catch (error) {
      console.error('Error generating homepage content:', error);
      throw error;
  }
}