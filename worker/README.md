# ⚙️ Backend – Cloudflare Worker

Tato složka obsahuje kód pro serverovou část (API), která běží v prostředí **Cloudflare Workers**. Zajišťuje sběr anonymních statistik a správu dat.

## 🛠️ Funkcionalita

Worker obsluhuje následující endpointy:

- `GET /track-visit`: Započítá unikátní návštěvu stránky.
- `GET /track-login-click`: Zaznamená kliknutí na tlačítko přihlášení.
- `GET /track-modal-view`: Zaznamená zobrazení edukačního okna.
- `POST /wtf`: Uloží věkovou skupinu uživatele (při stažení souhlasu).
- `GET /stats?key=ADMIN_KEY`: Zobrazí kompletní statistiky v JSON formátu (vyžaduje tajný klíč).
- `GET /delete?key=ADMIN_KEY`: Bezpečně vymaže celou databázi statistik.

## 📦 Nasazení (Deployment)

Pro nasazení je nutné mít nainstalované [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-upgrading/).

1. **Přihlášení ke Cloudflare:**
   ```bash
   npx wrangler login
   ```

2. **Nasazení workeru:**
   ```bash
   npx wrangler deploy
   ```

## 🔒 Konfigurace

Worker využívá **Cloudflare KV storage** s názvem `STATS`. Pro správnou funkci je nutné v Cloudflare dashboardu nebo ve `wrangler.toml` nastavit:
- KV Namespace Binding: `STATS`
- Environment Variable: `ADMIN_SECRET` (heslo pro přístup ke statistikám)

---
Pro obecné informace o projektu se podívejte do [hlavního README](../README.md).
