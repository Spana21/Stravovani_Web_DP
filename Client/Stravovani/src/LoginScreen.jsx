import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import './Login.css';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showModal, setShowModal] = useState(false);
  
  // --- NOVÝ STAV: Souhlas s podmínkami ---
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedAge, setSelectedAge] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    let hasError = false;
    setEmailError(false);
    setPasswordError(false);

    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }

    if (!hasError) {
      // Když otevíráme okno, resetujeme souhlas na "nezaškrtnuto"
      setIsAgreed(false); 
      setSelectedAge('');
      setShowModal(true);
    }

  };
    const handleDownload = () => {
    // 1. Vytvoříme neviditelný odkaz
    const link = document.createElement('a');
    link.href = '/informovany_souhlas.pdf'; // Cesta k souboru ve složce public
    link.download = 'Informovany_souhlas_ucastnika.pdf'; // Jak se bude soubor jmenovat po stažení
    document.body.appendChild(link);
    
    // 2. Klikneme na něj (tím se spustí stahování)
    link.click();
    
    // 3. Uklidíme po sobě a zavřeme okno
    document.body.removeChild(link);
    setShowModal(false);
    
  };

  const ageGroups = [
      "Méně než 15",
      "18 - 24",
      "25 - 34",
      "35 - 44",
      "45 - 54",
      "55 - 64",
      "65 a více"
    ];
  

  return (
    <div className="login-container">
      
{/* --- MODAL (ČERNÉ OKNO) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Toto je diplomová práce</h3>
            
            <p className="modal-text">
              Pro pokračování prosím vyplňte následující údaje a potvrďte souhlas.
            </p>

{/* ... část kódu v Login.jsx uvnitř modálního okna ... */}

            {/* --- 1. NOVÝ VZHLED VÝBĚRU VĚKU (SELECT DROPDOWN) --- */}
            <div className="age-selection-section">
              <p className="section-title">Jaký je váš věk?</p>
              
              {/* Místo radio buttonů použijeme SELECT */}
              <select 
                className="modal-select"
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
              >
                {/* První možnost je "placeholder", který nejde vybrat */}
                <option value="" disabled>Vyberte prosím věkovou skupinu...</option>
                
                {/* Zbytek možností se vygeneruje z pole ageGroups */}
                {ageGroups.map((age) => (
                  <option key={age} value={age} style={{color: 'black'}}>
                    {age} let
                  </option>
                ))}
              </select>
            </div>
            {/* -------------------------------------------------- */}

            {/* --- 2. SOUHLAS (Checkbox) --- */}
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

            {/* --- 3. TLAČÍTKO --- */}
            <button 
              onClick={handleDownload} 
              className="close-btn"
              disabled={!isAgreed || !selectedAge} 
            >
              Stáhnout dokument
            </button>
          </div>
        </div>
      )}
      {/* -------------------------- */}

      <div className="language-selector">
        <img 
          src="https://flagcdn.com/w20/cz.png" 
          alt="Česká vlajka"
          style={{ width: '20px', height: 'auto', borderRadius: '2px' }}
        />
        <span>Česky</span>
        <small>▼</small>
      </div>

      <div className="login-card">
        <h2>Přihlášení do aplikace</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label-text">Výběr zařízení:</label>
            <select className="full-width-select">
              <option>Univerzita obrany Brno</option>
              <option>Univerzita obrany Brno</option>
              <option>Štefánikova Brno</option>
              <option>VK Vyškov</option>
              <option>VK Praha</option>
              <option>VZS Gov</option>
              <option>VZS Chválkovice</option>
              <option>VZS Žižkova kasárna</option>
              <option>VZS Žatec</option>
              <option>VZS Moravská Třebová</option>
              <option>VZS Lipno - Resort Olšina</option>
            </select>
          </div>

          <div className="form-group">
            <div className={`input-with-icon ${emailError ? 'error-border' : ''}`}>
              <div className="icon-wrapper">
                <User size={18} />
              </div>
              <input 
                type="email" 
                placeholder="Emailová adresa" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if(e.target.value) setEmailError(false);
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <div className={`input-with-icon ${passwordError ? 'error-border' : ''}`}>
              <div className="icon-wrapper">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                placeholder="Heslo" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if(e.target.value) setPasswordError(false);
                }}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Přihlášení
          </button>

          <div className="links">
            <span>
              Jste zde poprvé ?? <a href="#">Zaregistrujte se.</a>
            </span>
            
            <div className="bottom-row">
              <label className="checkbox-label">
                <input type="checkbox" />
                Pamatovat přihlášení
              </label>
              <a href="#">Zapomenuté heslo?</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;