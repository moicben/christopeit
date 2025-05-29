import React from 'react';

const Certifications = ({ categories }) => {
  const certifications = [
    { id: 1, image: '/christopeit-reference-2.png', alt: 'Christopeit Sport Allemange' },
    { id: 2, image: '/christopeit-reference.png', alt: 'Christopeit Certification' },
  ];


  return (
    <section className="certifications bg-main">
      <div className="wrapper">
        {/* Première certification */}
        <div className="certification-item">
          <img src={certifications[0].image} alt={certifications[0].alt} />
        </div>

        {/* Contenu central */}
          <div className="certification-content">
            <h2>Expertise, conseil et qualité</h2>
            <p>Votre entraînement ne commence pas seulement par la première séance d'entraînement, mais par le bon choix de vos équipements sportifs. C'est pourquoi nous vous accompagnons personnellement et avec compétence dès le début. Nos produits sont créés avec le plus grand soin – toujours dans le but de combiner durabilité, fonctionnalité et technologie innovante.
            </p>
            <p className='strong'>Découvrez nos équipements :</p>
            {categories && categories.slice(1, 3).map(category => (
              <a key={category.id} href={category.url} className="btn-primary bg-primary">
                {category.name}
              </a>
            ))}
          </div>

          {/* Deuxième certification */}
        <div className="certification-item">
          <img src={certifications[1].image} alt={certifications[1].alt} />
        </div>
      </div>
    </section>
  );
};

export default Certifications;