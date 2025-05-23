import { readFile, writeFile } from 'fs/promises'

const filePath = 'c:\\Users\\bendo\\Desktop\\Documents\\Tech\\christopeit\\automation\\decathlon-products.json'

async function main() {
  const raw = await readFile(filePath, 'utf-8')
  const data = JSON.parse(raw)

  data.products = data.products.map(product => {
    let descHtml = ''

    if (Array.isArray(product.productDescription)) {
      descHtml = '<ul>' +
        product.productDescription
          .map(item => `<li>${item}</li><br>`)
          .join('') +
        '</ul>'
    } else if (
      typeof product.productDescription === 'object' &&
      product.productDescription !== null
    ) {
      descHtml = '<ul>' +
        Object.values(product.productDescription)
          .map(item => `<li>${item}</li><br>`)
          .join('') +
        '</ul>'
    } else if (typeof product.productDescription === 'string') {
      descHtml = `<ul><li>${product.productDescription}</li><br></ul>`
    }                                                                     

    product.productDescription = descHtml
    return product
  })

  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  console.log('✅ decathlon-products.json mis à jour avec productDescriptionHtml')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})