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
  
  const [showModal, setShowModal] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const id_attack = params.get('rid') || 'nezadano';

  // 1. STATISTIKA: Započítání návštěvy při načtení stránky
  useEffect(() => {
    if (WORKER_URL) {
      fetch(`${WORKER_URL}/visit?school=${id_attack}`)
        .then(res => console.log("Návštěva odeslána pro:", id_attack))
        .catch(err => console.error("Chyba při odesílání návštěvy:", err));
    }
  }, [id_attack]);

  const handleLogin = (e) => {
    e.preventDefault();

    let hasError = false;
    setEmailError(false);
    setPasswordError(false);

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError(true);
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }

    if (!hasError) {
      setShowModal(true);
      
      // 2. STATISTIKA: Započítání kliknutí na tlačítko "Přihlášení" s platnými údaji
      fetch(`${WORKER_URL}/track-login-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school: id_attack })
      }).catch(console.error);

      // 3. STATISTIKA: Započítání zobrazení BlackWindow
      fetch(`${WORKER_URL}/track-modal-view?school=${id_attack}`).catch(console.error);
    }
  };

  return (
    <div className="login-container">
      
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
            {emailError && <span style={{color: 'red', fontSize: '12px'}}>Zadejte platný e-mail.</span>}
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