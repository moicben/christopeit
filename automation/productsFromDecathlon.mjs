import puppeteer from 'puppeteer';
import fs from 'fs';
import OpenAI from 'openai';

// Configurez votre clé API OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const url = 'https://www.decathlon.fr/tous-les-sports/musculation-cross-training/halteres-musculation';

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeSlug(title) {
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




async function main() {
  try {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1440x1080',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
            '--disable-features=IsolateOrigins,site-per-process'
        ],
        ignoreDefaultArgs: ['--disable-extensions']
    });

    const page = await browser.newPage();

    // Liste des URLs paginées à parcourir
    const paginatedUrls = [
      'https://www.decathlon.fr/tous-les-sports/musculation-cross-training/halteres-musculation?from=0&size=40',
      'https://www.decathlon.fr/tous-les-sports/musculation-cross-training/halteres-musculation?from=40&size=40',
      'https://www.decathlon.fr/tous-les-sports/musculation-cross-training/halteres-musculation?from=80&size=40'
    ];

    // Récupère directement les URLs au lieu de garder des JSHandles across navigations
    let productUrls = [];
    for (const paginatedUrl of paginatedUrls) {
      await page.goto(paginatedUrl, { waitUntil: 'networkidle0' });
      await delay(2000);
      const urls = await page.$$eval(
        'a.dpb-product-model-link.svelte-1bclr8g',
        els => els.map(el => el.href)
      );
      productUrls.push(...urls);
      console.log(`Found ${urls.length} products on ${paginatedUrl}`);
    }
    console.log(`Total products found: ${productUrls.length}`);

    const productList = [];
    let count = 0;
    for (const productSource of productUrls) {
      const product = { productSource };
      try {
        const productPage = await browser.newPage();
        await productPage.goto(productSource, { waitUntil: 'networkidle0' });

        // Click on view pictures button
        const viewMoreButton = await productPage.$('div.vtmn-col-span-2.product-main-infos__gallery ul > li:nth-child(1) > button');
        if (viewMoreButton) {
          await viewMoreButton.click();
          await delay(2000);
        }

        const productTitleElement = await productPage.$('h1');
        const productDescriptionElements = await productPage.$$('p.vtmn-text-base.vtmn-mt-2, p.vtmn-text-base.vtmn-mb-0');
        const productAdvantagesElements = await productPage.$$('section.benefit');
        const productDetailsElements = await productPage.$$('.content');
        const productImageElements = await productPage.$$('#vtmn-modal-description img.swiper-zoom-target.svelte-11itto');

        product.productTitle = productTitleElement ? await productPage.evaluate(el => el.textContent.trim(), productTitleElement) : product.productTitle;
        product.productPrice = await productPage.evaluate(el => el.textContent.trim(), await productPage.$('span.vtmn-price.vtmn-price_size--large.vtmn-price_variant--accent'));
        product.productImages = await Promise.all(productImageElements.map(async image => await productPage.evaluate(el => el.src, image)));
        
        product.productDescription = await Promise.all(productDescriptionElements.map(async description => await productPage.evaluate(el => el.innerHTML.trim(), description)));
        product.productAdvantages = await Promise.all(productAdvantagesElements.map(async advantage => await productPage.evaluate(el => el.innerHTML.trim(), advantage)));
        product.productDetails = await Promise.all(productDetailsElements.map(async detail => await productPage.evaluate(el => el.innerHTML.trim(), detail)));
        
        // Convert price to numeric value with float 2 decimal
        product.productPrice = parseFloat(product.productPrice.replace(/[^0-9.,]/g, '').replace("€", "").replace(',', '.')).toFixed(2);

        // Generate slug from Title (OpenAI) 
        product.slug = await writeSlug(product.productTitle);

        await productPage.close();
      } catch (error) {
        console.error(`Error processing ${productSource}:`, error);
        continue;
      }
      productList.push(product);
      count++;
      console.log(`Processed ${count} of ${productUrls.length} products.`);
    }

    await browser.close();

    fs.writeFileSync('decathlon-products.json', JSON.stringify({ products: productList }, null, 2));
    console.log('Products saved to decathlon-products.json');
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

main();