import React, { useState } from 'react';

function DiplomkaModal({ isOpen, onClose }) {
  // Stavy pro věk a souhlas přesuneme SEM, protože rodiče to nezajímá
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedAge, setSelectedAge] = useState('');

  // Pokud okno není otevřené, nic nevykreslíme
  if (!isOpen) return null;

  const ageGroups = [
    "Méně než 15", "18 - 24", "25 - 34", "35 - 44",
    "45 - 54", "55 - 64", "65 a více"
  ];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/informovany_souhlas.pdf'; 
    link.download = 'Informovany_souhlas_ucastnika.pdf'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Po stažení zavřeme okno (funkce poslaná od rodiče)
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Toto je diplomová práce</h3>
        
        <p className="modal-text">
          Pro pokračování prosím vyplňte následující údaje a potvrďte souhlas.
        </p>

        {/* --- VÝBĚR VĚKU --- */}
        <div className="age-selection-section">
          <p className="section-title">Jaký je váš věk?</p>
          <select 
            className="modal-select"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
          >
            <option value="" disabled>Vyberte prosím věkovou skupinu...</option>
            {ageGroups.map((age) => (
              <option key={age} value={age} style={{color: 'black'}}>
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
            Souhlasím
          </label>
        </div>

        {/* --- TLAČÍTKO --- */}
        <button 
          onClick={handleDownload} 
          className="close-btn"
          disabled={!isAgreed || !selectedAge} 
        >
          Stáhnout dokument
        </button>
      </div>
    </div>
  );
}

export default DiplomkaModal;