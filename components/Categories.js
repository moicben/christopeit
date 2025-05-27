import React, { useState } from 'react';

const Categories = ({ categories, title, data }) => {
  // Filter out "all" and "bestsellers"
  const filteredCategories = categories.filter(
    c => c.slug !== "all"
  );

  // Sort by `order` ascending
  const sortedCategories = [...filteredCategories].sort(
    (a, b) => a.order - b.order
  );

  // Fonction pour gérer l'ajout et la suppression de classes
  const handleMouseEnter = e => e.target.classList.add("bg-primary");
  const handleMouseLeave = e => e.target.classList.remove("bg-primary");

  return (
    <section className="categories">
      <div className="wrapper">
        {title && <h2>{title}</h2>}
        <div className="category-grid">
          {sortedCategories.map((category, index) => (
            <a
              href={`/${category.slug}`}
              key={index}
              className="category-card"
              style={{ backgroundImage: `url(${category.image})` }}
            >
              <div className="category-content">
                <h3>{category.name}</h3>
                <p
                  className="category-button"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {data.categoryCta}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;