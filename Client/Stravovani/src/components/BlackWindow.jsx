import React, { useState } from 'react';

// Tady si definujeme adresu Workeru (stejná jako v LoginScreen)
const WORKER_URL = "https://stravovani-worker.spaniklukas.workers.dev";

function DiplomkaModal({ isOpen, onClose }) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedAge, setSelectedAge] = useState('');

  if (!isOpen) return null;

  const ageGroups = [
    "Méně než 17", "18 - 24", "25 - 34", "35 - 44",
    "45 - 54", "55 - 64", "65 a více"
  ];

  const handleDownload = () => {
    // 1. Spustíme stažení souboru (simulace)
    const link = document.createElement('a');
    link.href = '/informovany_souhlas.pdf'; 
    link.download = 'Informovany_souhlas_ucastnika.pdf'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. NOVÉ: Odešleme vybraný věk na server
    fetch(`${WORKER_URL}/wtf`, {
      method: 'POST', // Používáme POST pro odeslání dat
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ age: selectedAge }) // Pošleme vybraný věk
    })
    .then(res => console.log("Věk odeslán do statistiky"))
    .catch(err => console.error("Chyba při odesílání věku:", err));
    
    // 3. Zavřeme okno
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Právě jste se stali součástí testování!</h3>
        
        <div className="modal-info-section">
          <p className="modal-text">
            Tato stránka není skutečným přihlašovacím portálem. Jedná se o <strong>simulaci phishingového útoku</strong>, 
            která je součástí výzkumu pro mou <strong>diplomovou práci</strong>.
          </p>

          <p className="github-info">
            Celý projekt je transparentní a jeho zdrojový kód si můžete prohlédnout na 
            <a href="https://github.com/Spana21/Stravovani_Web_DP" target="_blank" rel="noopener noreferrer" className="github-link"> GitHubu</a>.
          </p>
          
          <div className="security-guarantee">
            <h4>🛡️ Vaše data jsou v bezpečí</h4>
            <p>
              Vaše heslo ani e-mail <strong>nebyly nikde uloženy</strong>. Tato aplikace je navržena tak, aby pouze 
              zaznamenala anonymní statistiku (že na stránku někdo přišel a klikl na tlačítko). 
              Jediný údaj, který o sobě můžete dobrovolně poskytnout pro potřeby výzkumu, je vaše věková kategorie níže.
            </p>
          </div>
        </div>

        <div className="education-section">
          <h4>💡 Jak poznat phishing příště?</h4>
          <ul className="edu-list">
            <li><strong>Zkontrolujte adresu (URL):</strong> Skutečné systémy mají jasnou a oficiální adresu. Útočníci často používají podobné nebo podezřelé domény.</li>
            <li><strong>Podezřelý odesílatel:</strong> Vždy si ověřte, z jaké e-mailové adresy vám přišla výzva k přihlášení.</li>
            <li><strong>Nátlak a urgentnost:</strong> Phishing často straší (např. "Váš účet bude zablokován"), aby vás přiměl jednat bez přemýšlení.</li>
            <li><strong>Zabezpečení:</strong> Moderní prohlížeče vás často varují, ale nejlepším štítem je vaše obezřetnost.</li>
          </ul>
        </div>

        <hr className="modal-divider" />

        {/* --- VÝBĚR VĚKU --- */}
        <div className="age-selection-section">
          <p className="section-title">Pomozte mi s výzkumem: Jaký je váš věk?</p>
          <select 
            className="modal-select"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
          >
            <option value="" disabled>Vyberte prosím věkovou skupinu...</option>
            {ageGroups.map((age) => (
              <option key={age} value={age}>
                {age} let
              </option>
            ))}
          </select>
        </div>

        {/* --- SOUHLAS --- */}
        <div className="agreement-wrapper">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
            />
            Souhlasím se zapojením do anonymního výzkumu
          </label>
        </div>

        {/* --- TLAČÍTKO --- */}
        <div className="modal-footer">
          <p className="small-note">Kliknutím na tlačítko stáhnete informovaný souhlas a okno se zavře.</p>
          <button 
            onClick={handleDownload} 
            className="close-btn"
            disabled={!isAgreed || !selectedAge} 
          >
            Stáhnout dokument a dokončit
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiplomkaModal;