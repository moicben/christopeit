import React from 'react';

const Certifications = () => {
  const certifications = [
    { id: 1, image: '/christopeit-reference-2.png', alt: 'Christopeit Sport Allemange' },
    { id: 2, image: '/christopeit-reference.png', alt: 'Christopeit Certification' },
  ];

  return (
    <section className="certifications">
      <div className="wrapper">
        {/* Première certification */}
        <div className="certification-item">
          <img src={certifications[0].image} alt={certifications[0].alt} />
        </div>

        {/* Contenu central */}
        <div className="certification-content">
          <h2>Expertise, conseil et qualité</h2>
          <p>Votre entraînement ne commence pas seulement par la première séance d’entraînement, mais par le bon choix d’appareils de fitness. C’est pourquoi nous vous accompagnons personnellement et avec compétence dès le début. Nos produits sont créés avec le plus grand soin – toujours dans le but de combiner durabilité, fonctionnalité et technologie innovante.
          </p>
          <p className='strong'>Découvrez nos équipements :</p>
          <a href="/velos-appartement" className="btn-primary bg-primary">
            Vélos d'appartement
          </a>
          <a href="/rameurs" className="btn-primary bg-primary">
            Rameurs intérieurs
          </a>
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