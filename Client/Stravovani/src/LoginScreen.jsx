import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import './Login.css';

// Importujeme naše nové komponenty
import LanguageSelector from './components/LanguageSelector.jsx';
import DiplomkaModal from './components/BlackWindow.jsx';

function LoginScreen() {
  // Zde řešíme už jen přihlášení
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Stav pro otevření/zavření okna
  const [showModal, setShowModal] = useState(false);

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
      // Pokud je vše OK, otevřeme okno
      setShowModal(true);
    }
  };

  return (
    <div className="login-container">
      
      {/* 1. Komponenta modálního okna */}
      {/* Předáváme mu informaci, zda má být otevřené (isOpen) */}
      {/* A funkci, co se má stát, když se zavře (onClose) */}
      <DiplomkaModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />

      {/* 2. Komponenta jazyka */}
      <LanguageSelector />

      {/* 3. Zbytek (Přihlašovací karta) */}
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