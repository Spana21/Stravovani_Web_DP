# 💻 Frontend – Klientská aplikace (Stravování)

Tato složka obsahuje frontendovou část phishingové simulace. Aplikace je postavena na frameworku **React** a využívá nástroj **Vite** pro rychlý vývoj a sestavení.

## 🚀 Rychlý start

1. **Instalace závislostí:**
   ```bash
   npm install
   ```

2. **Spuštění vývojového serveru:**
   ```bash
   npm run dev
   ```

3. **Sestavení pro produkci:**
   ```bash
   npm run build
   ```

## 📂 Struktura složky `src`

- `components/`: Znovupoužitelné UI komponenty.
  - `BlackWindow.jsx`: Modální okno s edukací a informovaným souhlasem.
  - `LanguageSelector.jsx`: Přepínač jazyků (vizuální prvek).
- `LoginScreen.jsx`: Hlavní přihlašovací obrazovka se simulovaným formulářem.
- `Login.css`: Kompletní stylování aplikace (včetně efektů skla a responzivity).
- `main.jsx`: Vstupní bod aplikace.

## 🔗 Propojení s backendem

Aplikace komunikuje s Cloudflare Workerem pomocí `fetch` požadavků. Adresa workeru je definována v souboru `LoginScreen.jsx` v proměnné `WORKER_URL`.

---
Pro obecné informace o projektu se podívejte do [hlavního README](../../README.md).
