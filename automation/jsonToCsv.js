const fs = require('fs');
const { Parser } = require('json2csv');

// Lire le fichier JSON
const jsonFilePath = './decathlon-products.json';
const csvFilePath = './products.csv';

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erreur lors de la lecture du fichier JSON:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const products = jsonData.products;

    // Transformer les données pour correspondre aux nouvelles colonnes
    const transformedData = products.map(product => ({
      category_id: 10, // Valeur fixe
      shop_id: 1, // Valeur fixe
      slug: product.slug,
      title: product.productTitle,
      desc: product.productDescription, 
      metaTitle: product.productTitle,
      metaDesc: product.productDescription,
      images: JSON.stringify(product.productImages),
      price: product.productPrice?.replace(/[^0-9.,]/g, '').trim(),
      delivery: 'Fast',
      stock: 'En stock',
      advantages: product.productAdvantages,
      more1: product.productDetails,
    }));

    // Convertir en CSV
    const parser = new Parser();
    const csv = parser.parse(transformedData);

    // Écrire le fichier CSV
    fs.writeFile(csvFilePath, csv, 'utf8', err => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier CSV:', err);
        return;
      }
      console.log('Fichier CSV généré avec succès:', csvFilePath);
    });
  } catch (parseError) {
    console.error('Erreur lors de l\'analyse du fichier JSON:', parseError);
  }
});