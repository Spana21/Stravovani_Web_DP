import React, { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import './Login.css';


import LanguageSelector from './components/LanguageSelector.jsx';
import DiplomkaModal from './components/BlackWindow.jsx';

// ADRESA WORKERA
const WORKER_URL = "https://stravovani-worker.spaniklukas.workers.dev";

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  // Stav pro otevření/zavření okna
  const [showModal, setShowModal] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const schoolId = params.get('rid') || 'nezadano';

  // 1. STATISTIKA: Započítání návštěvy při načtení stránky
   useEffect(() => {
    if (WORKER_URL) {
      fetch(`${WORKER_URL}/visit?school=${schoolId}`)
        .then(res => console.log("Návštěva odeslána pro:", schoolId))
        .catch(err => console.error("Chyba při odesílání návštěvy:", err));
    }
  }, [schoolId]);

  const handleLogin = (e) => {
    e.preventDefault();

    // 2. STATISTIKA: Započítání kliknutí na tlačítko "Přihlášení"
    fetch(`${WORKER_URL}/track-login-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ school: schoolId })
    }).catch(console.error);

    let hasError = false;
    setEmailError(false);
    setPasswordError(false);

    // Validace
    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }

  
    if (!hasError) {
 
      setShowModal(true);

      // 3. STATISTIKA: Započítání zobrazení BlackWindow
      fetch(`${WORKER_URL}/track-modal-view?school=${schoolId}`).catch(console.error);
    }
  };

  return (
    <div className="login-container">
      
      {/* Modální okno */}
      <DiplomkaModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />

      <LanguageSelector />

      <div className="login-card">
        <h2>Přihlášení do aplikace</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label-text">Výběr zařízení:</label>
            <select className="full-width-select">
              <option>Univerzita obrany Brno</option>
              <option>Jiná univerzita</option>
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
                autoComplete="current-password"
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