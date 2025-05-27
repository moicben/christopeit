import { useEffect, useState } from 'react';

function gtag_report_conversion(url) {
  const callback = () => {
    if (typeof url !== 'undefined') {
      window.location = url;
    }
  };
  window.gtag('event', 'conversion', {
    send_to: 'AW-16785527373/4ln6CMra5M0aEM2k-8M-',
    event_callback: callback
  });
  return false;
}

const SimulatorPopup = ({ products = [], categories = [], shop, data }) => {
  const [isVisible, setIsVisible]       = useState(false);
  const [step, setStep]                 = useState(1);
  const [levelChoice, setLevelChoice]   = useState(null);
  const [objectiveChoice, setObjectiveChoice] = useState(null);
  const [budgetChoice, setBudgetChoice] = useState(null);

  // 1) Affiche la popup une seule fois par session, après 10 s
  useEffect(() => {
    const shown = sessionStorage.getItem('SimulatorPopupShown');
    if (!shown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('SimulatorPopupShown', 'true');
      }, 16000);
      return () => clearTimeout(timer);
    }
  }, []);

  // 2) Bloque le scroll de la page quand la popup est visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const handleClose = () => setIsVisible(false);
  const handleNext  = () => setStep(prev => Math.min(prev + 1, 6));

  if (!isVisible) return null;

  // force array
  const productList = Array.isArray(products) ? products : products ? [products] : [];

  // filtre budget + niveau
  const filtered = productList
    .filter(p => {
      // catégories 10, 11 ou 12
      if (![10, 11, 12].includes(p.category_id)) return false;
      let okBudget = true;
      if (budgetChoice === 'low')    okBudget = p.price > 10 && p.price < 25;
      if (budgetChoice === 'medium') okBudget = p.price > 25 && p.price < 75;
      if (budgetChoice === 'high')   okBudget = p.price >= 75;

      let weights = [];
      try { weights = JSON.parse(p.weight || '[]').map(Number); }
      catch { /* silent */ }
      const maxW = weights.length ? Math.max(...weights) : 0;

      let okLevel = true;
      if (levelChoice === 'beginner')     okLevel = maxW <= 10;
      if (levelChoice === 'intermediate') okLevel = maxW > 10 && maxW <= 20;
      if (levelChoice === 'advanced')     okLevel = maxW > 20;

      return okBudget && okLevel;
    })
    .slice(0, 6);

  // si aucun résultat, on prend ces IDs par défaut
  const fallbackIds = [69214, 69192, 69190, 69200, 69221,69292];
  const displayResults = filtered.length > 0
    ? filtered
    : productList.filter(p => fallbackIds.includes(p.id));

  return (
    <div className="simulator-overlay">
      <div className="simulator-popup">
        <button className="close-btn" onClick={handleClose}>×</button>

        <article className={step === 1 ? 'active' : ''}>
          
          <h2><span className="color-primary">10€ offert</span> sur votre commande</h2>
          <h3>Découvrez vos haltères idéales, et recevez de 10€ de réduction immédiate dessus !</h3>
          <img src="/simulator.jpg" alt="Simulator" className="simulator-image" />
          <button className="start-btn" onClick={handleNext}>Débuter la simulation</button>
          <p className="smaller">Uniquement pour les nouveaux clients, non-cumulable aux promotions.</p>
        </article>

        <article className={step === 2 ? 'active' : ''}>
          <h4>{step - 1}/4</h4>
          <h2>Quel est votre niveau de pratique ?</h2>
          <div className="levels">
            <button className="level beginner" onClick={() => { setLevelChoice('beginner'); handleNext(); }}>Débutant</button>
            <button className="level intermediate" onClick={() => { setLevelChoice('intermediate'); handleNext(); }}>Intermédiaire</button>
            <button className="level advanced" onClick={() => { setLevelChoice('advanced'); handleNext(); }}>Avancé</button>
          </div>
        </article>

        <article className={step === 3 ? 'active' : ''}>
          <h4>{step - 1}/4</h4>
          <h2>Quel est votre objectif ?</h2>
          <div className="objectives">
            <button className="objective strength" onClick={() => { setObjectiveChoice('strength'); handleNext(); }}>Force</button>
            <button className="objective endurance" onClick={() => { setObjectiveChoice('endurance'); handleNext(); }}>Endurance</button>
            <button className="objective hypertrophy" onClick={() => { setObjectiveChoice('hypertrophy'); handleNext(); }}>Hypertrophie</button>
          </div> 
        </article>

        <article className={step === 4 ? 'active' : ''}>
          <h2>Quel est votre budget ?</h2>
          <div className="budgets">
            {['low','medium','high'].map(b => (
              <button
                key={b}
                className={`budget ${b}`}
                onClick={() => {
                  // déclenchement de la conversion avant de passer à l'étape suivante
                  gtag_report_conversion();
                  setBudgetChoice(b);
                  handleNext();
                }}
              >
                {b === 'low' ? 'Moins de 25€' : b === 'medium' ? '25€ à 75€' : 'Plus de 75€'}
              </button>
            ))}
          </div>
          <p className='smaller'>Vous allez découvrir le résultat de votre simulation à la prochaine étape.</p>
        </article>

        <article className={step === 5 ? 'active' : ''}>
          <h4 className='color-primary'>{step - 1}/4 : Résultat</h4>
          <h2>recommandations personnalisées :</h2>
          <div className="product-grid">
            {displayResults.map(p => {
              const slugCat = categories.find(c => c.id === p.category_id)?.slug || '';
              return (
                <a key={p.id} href={`/${slugCat}/${p.slug}`} className="product-item" target="_blank">
                  <img src={p.images?.[0]} alt={p.title} />
                  <h3>{p.title}</h3>
                  <p className="price">
                  <span className='new-price color-primary'>{(p.price - 10).toFixed(2)}€</span>
                  <span className='old-price'>{p.price}€</span>
                  </p>
                </a>
              );
            })}
          </div>
          <p className="smaller end">🖱️ Cliquez sur un produit pour le découvrir dans un nouvel onglet</p>
          <h3 className='result'>Votre code de réduction : <span className="color-primary">SIMU10{Math.floor(Math.random() * (987 - 156 + 1)) + 156}</span></h3>
            <h5>Avant de fermer cette fenêtre, copier le code.</h5>
        </article>
      </div>
    </div>
  );
};

export default SimulatorPopup;