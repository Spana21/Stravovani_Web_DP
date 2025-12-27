import React from 'react';

function LanguageSelector() {
  return (
    <div className="language-selector">
      <img 
        src="https://flagcdn.com/w20/cz.png" 
        alt="Česká vlajka"
        style={{ width: '20px', height: 'auto', borderRadius: '2px' }}
      />
      <span>Česky</span>
      <small>▼</small>
    </div>
  );
}

export default LanguageSelector;