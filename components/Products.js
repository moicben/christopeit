import React, { useState, useRef, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Pagination from './Pagination'; // Import du composant Pagination

const Products = ({ title, products, description, showCategoryFilter = true, initialCategoryFilter = 'all', disablePagination = false, categories, data, shop }) => {
  const [currentPage, setCurrentPage]   = useState(1);
  const [sortOrder, setSortOrder]       = useState('bestsellers');
  const [priceRange, setPriceRange]     = useState('all');
  const [weightRange, setWeightRange]   = useState('all');    // ← nouveau
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const productsPerPage = 15;
  const productListRef = useRef(null);

  // 1) Nouveaux hooks pour le sticky
  const [stickyFilters, setStickyFilters] = useState(false);
  const filtersRef = useRef(null);
  const productsSectionRef = useRef(null); // Référence pour la section des produits

  // Création d'un dictionnaire pour accéder rapidement aux slugs des catégories par leur ID
  const categorySlugMap = (categories || []).reduce((map, category) => {
    map[category.id] = category.slug;
    return map;
  }, {});

  // utilitaire pour extraire un tableau de valeurs depuis la colonne weight (JSON)
  const getWeights = (weightJson) => {
    if (!weightJson) return [];
    let arr;

    // cas où la colonne arrive déjà sous forme de tableau JS
    if (Array.isArray(weightJson)) {
      arr = weightJson;
      //console.log("getWeights – input array:", arr);
    } else {
      try {
        arr = JSON.parse(weightJson);
        //console.log("getWeights – after JSON.parse:", arr);
      } catch (error) {
        console.warn("getWeights – JSON.parse failed:", error);
        // si ce n'était pas un JSON, on tente un parseFloat
        const n = parseFloat(weightJson);
        return isNaN(n) ? [] : [n];
      }
    }

    // convertir en nombres et filtrer les NaN
    return arr
      .map(v => Number(v))
      .filter(n => !isNaN(n));
  };

  const filteredProducts = products.filter(product => {
    const price = product.price;
    const priceMatch = 
                        (priceRange === '0-50' && price >= 0 && price < 50) ||
                        (priceRange === '50-100' && price >= 50 && price < 100) ||
                        (priceRange === '100-200' && price >= 100 && price < 200) ||
                       (priceRange === '200-300' && price >= 200 && price < 300) ||
                       (priceRange === '300-400' && price >= 300 && price < 400) ||
                       (priceRange === '400+' && price >= 400) ||
                       (priceRange === 'all');
    const categoryMatch = categoryFilter === 'all' ||
                          (categoryFilter === 'bestsellers' && product.bestseller === true) ||
                          product.productCategorySlug === categoryFilter;

    // récupère toutes les valeurs numériques du JSON
    const weights = getWeights(product.weight);
    if (!weights.length) return priceMatch && categoryMatch; 

    // on considère l’intervalle [min, max]
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);

    let weightMatch = false;
    switch (weightRange) {
      case '0-5':
        weightMatch = minW <= 5 && maxW >= 0;
        break;
      case '5-10':
        weightMatch = minW <= 10 && maxW >= 5;
        break;
      case '10-20':
        weightMatch = minW <= 20 && maxW >= 10;
        break;
      case '20-40':
        weightMatch = minW <= 40 && maxW >= 20;
        break;
      case '40+':
        weightMatch = maxW >= 40;
        break;
      default:
        weightMatch = true;
    }

    return priceMatch && categoryMatch && weightMatch;
  });

  // 🔹 Trier : bestsellers en premier, puis critère choisi (price, alpha, weight), fallback id décroissant
  const sortedProducts = filteredProducts
    .slice()
    .sort((a, b) => {
      let cmp = 0;
      if (sortOrder === 'asc') {
        cmp = a.price - b.price;
      } else if (sortOrder === 'desc') {
        cmp = b.price - a.price;
      } else if (sortOrder === 'az') {
        cmp = a.title.localeCompare(b.title);
      } else if (sortOrder === 'za') {
        cmp = b.title.localeCompare(a.title);
      } else if (sortOrder === 'weight_asc' || sortOrder === 'weight_desc') {
        // on récupère toutes les valeurs
        const waArr = getWeights(a.weight);
        const wbArr = getWeights(b.weight);
        // ici on compare par exemple sur la plus petite valeur
        const wa = waArr.length ? Math.min(...waArr) : 0;
        const wb = wbArr.length ? Math.min(...wbArr) : 0;
        cmp = wa - wb;
        if (sortOrder === 'weight_desc') cmp = -cmp;
      }
      else if (sortOrder === 'bestsellers') {
        // On place les bestsellers en premier
        if (a.bestseller && !b.bestseller) return -1;
        if (!a.bestseller && b.bestseller) return 1;
        cmp = a.id - b.id; // Si les deux sont bestsellers, on compare par ID
      }
      return cmp !== 0 ? cmp : b.id - a.id;
    });
  
  const indexOfLastProduct  = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = disablePagination
    ? sortedProducts
    : sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: productListRef.current.offsetTop - 100,
      behavior: 'smooth'
    });
  };

  const getDeliveryDate = (deliveryType) => {
    const today = new Date();
    let deliveryDays;
    if (deliveryType === 'Express') {
      deliveryDays = 4;
    } else if (deliveryType === 'Fast') {
      deliveryDays = 5;
    } else if (deliveryType === 'Normal') {
      deliveryDays = 6;
    } else {
      return '';
    }

    const languageMap = {
      FR: fr,
      EN: undefined,
      DE: require('date-fns/locale/de'),
      ES: require('date-fns/locale/es'),
      IT: require('date-fns/locale/it'),
      PT: require('date-fns/locale/pt'),
      NL: require('date-fns/locale/nl'),
      RU: require('date-fns/locale/ru'),
      ZH: require('date-fns/locale/zh-CN'),
      JA: require('date-fns/locale/ja'),
      KO: require('date-fns/locale/ko'),
      AR: require('date-fns/locale/ar'),
      SV: require('date-fns/locale/sv'),
      NO: require('date-fns/locale/nb'),
      DA: require('date-fns/locale/da'),
      FI: require('date-fns/locale/fi'),
      PL: require('date-fns/locale/pl'),
      TR: require('date-fns/locale/tr'),
      CS: require('date-fns/locale/cs'),
      HU: require('date-fns/locale/hu'),
      RO: require('date-fns/locale/ro')
    };
          
    // console.log("LANGUEEE" + shop.language)
    const language = languageMap[shop.language]; // Utilisation de la locale correspondante ou undefined par défaut
    const deliveryDate = addDays(today, deliveryDays);
    return format(deliveryDate, 'EEE dd MMM', { locale: language});
  };

  // 2) Effet scroll pour activer/désactiver le sticky et cacher les filtres
  useEffect(() => {
    const handleScroll = () => {
      if (!filtersRef.current || !productsSectionRef.current) return;

      const triggerOffset = filtersRef.current.offsetTop;
      const sectionBounds = productsSectionRef.current.getBoundingClientRect();

      // Activer le sticky uniquement si la section est visible dans la fenêtre
      const isSectionVisible = sectionBounds.top < window.innerHeight && sectionBounds.bottom > 0;

      setStickyFilters(
        isSectionVisible && window.scrollY > triggerOffset
      );
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="products" ref={productsSectionRef}>
      <div className='wrapper'>
        {title && <h2>{title}</h2>}

        {/* 3) on lie le ref et on ajoute la classe sticky */}
        <div
          ref={filtersRef}
          className={`product-filters${stickyFilters ? ' sticky' : ''}`}
          style={{ display: stickyFilters ? 'flex' : 'none' }} // Cacher les filtres si stickyFilters est false
        >
          <div className='sort-dropdown'>
            <label htmlFor="sortOrder">Trier par : </label>
            <select 
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="bestsellers">Bestsellers</option>
              <option value="az">Ordre alphabétique</option>
              <option value="asc">Prix croissant (-/+)</option>
              <option value="desc">Prix décroissant (+/-)</option>
              <option value="weight_asc">Poids croissant</option>
              <option value="weight_desc">Poids décroissant</option>
            </select>
          </div>

          {/* <div className='sort-dropdown'>
           <label htmlFor="weightRange">Tranche de poids :</label>
           <select
             id="weightRange"
             value={weightRange}
             onChange={e => setWeightRange(e.target.value)}
           >
             <option value="all">Tous</option>
             <option value="0-5">0 à 5 KG</option>
             <option value="5-10">5 à 10 KG</option>
             <option value="10-20">10 à 20 KG</option>
             <option value="20-40">20 à 40 KG</option>
             <option value="40+">40 KG et +</option>
           </select>
         </div> */}

          <div className='sort-dropdown'>
            <label htmlFor="priceRange">Tranche de prix : </label>
            <select 
              id="priceRange"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">Toutes</option>
              <option value="0-50">0 - 50 {shop.currency}</option>
              <option value="50-100">100 - 200 {shop.currency}</option>
              <option value="100-200">100 - 200 {shop.currency}</option>
              <option value="200-300">200 - 300 {shop.currency}</option>
              <option value="300-400">300 - 400 {shop.currency}</option>
              <option value="400+">400+ {shop.currency}</option>
            </select>
          </div>
         
        </div>

        <div className="product-list" ref={productListRef}>
          {currentProducts.map(product => {
            const categorySlug = categorySlugMap[product.category_id]; // Récupération du slug de la catégorie via category_id
            if (!categorySlug) {
              console.warn(`Aucun slug trouvé pour la catégorie avec ID ${product.category_id}`);
              return null; // Ignorer les produits sans catégorie correspondante
            }
            return (
              <a
              href={`/${categorySlug}/${product.slug}`}
              key={product.id}
              className='product-item'
              onMouseEnter={() => setHoveredProduct(product.slug)}
              onMouseLeave={() => setHoveredProduct(null)}
              >
              
              <div className='infos-wrap'>
                {product.bestseller &&
                  <span className='bestseller bg-main color-primary'>🏆 {data.productBestsellerLabel}</span>
                }
                {product.weight && (() => {
                  const w = getWeights(product.weight);
                  if (!w.length) return null;
                  const min = Math.min(...w);
                  const max = Math.max(...w);
                  return (
                    <span className='weight'>
                      {min === max
                        ? `${min}KG`
                        : `${min}-${max}KG`}
                    </span>
                  );
                })()}
              </div>

              <img
                src={
                hoveredProduct === product.slug && product.images?.[1]
                  ? product.images[1]
                  : product.images?.[0]
                }
                alt={product.title}
              />
              <h3>{product.title}</h3>
              <p className={`stock ${product.stock.startsWith(data.productStockLowLabel) ? 'low' : ''}`}>
                <span>⋅</span>{product.stock}
              </p>
              <p className='delivery'>{data.productDeliveryLabel} {getDeliveryDate(product.delivery)}</p>
              <p className='price'></p>
              <p>
                {product.discounted ? (
                <>
                  <span className='initial-price'>{product.discounted.toLocaleString(shop.language, { minimumFractionDigits: 2 })}{shop.currency}</span>
                  <span className='new-price color-primary'>{product.price.toLocaleString(shop.language, { minimumFractionDigits: 2 })}{shop.currency}</span>
                </>
                ) : (
                `${product.price.toLocaleString(shop.language, { minimumFractionDigits: 2 })}${shop.currency}`
                )}
              </p>
              </a>
            );
          })}
        </div>
        {!disablePagination && filteredProducts.length > productsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default Products;