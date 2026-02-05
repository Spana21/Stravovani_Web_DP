export default {
  async fetch(request, env) {
    // Definice věkových skupin (musí být stejné jako v Reactu)
    const ADMIN_KEY = env.ADMIN_SECRET;
    
    const AGE_GROUPS = [
      "Méně než 15", "18 - 24", "25 - 34", "35 - 44",
      "45 - 54", "55 - 64", "65 a více"
    ];

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    const urlKey = url.searchParams.get("key");

    try {
      // -------------------------------------------------------------
      // ZÁPIS DAT 
      // -------------------------------------------------------------
    
      // 1. Započítat návštěvu
      if (url.pathname === "/track-visit") {
        let visits = await env.STATS.get("visits");
        visits = parseInt(visits || 0) + 1;
        await env.STATS.put("visits", visits.toString());
        return new Response(JSON.stringify({ total: visits }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // 2. Započítat kliknutí na Login
      if (url.pathname === "/track-login-click") {
        let clicks = await env.STATS.get("login_clicks");
        clicks = parseInt(clicks || 0) + 1;
        await env.STATS.put("login_clicks", clicks.toString());
        return new Response(JSON.stringify({ total: clicks }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // 3. Započítat zobrazení okna
      if (url.pathname === "/track-modal-view") {
        let views = await env.STATS.get("modal_views");
        views = parseInt(views || 0) + 1;
        await env.STATS.put("modal_views", views.toString());
        return new Response(JSON.stringify({ total: views }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Ukládání věku (POST /wtf)
      if (url.pathname === "/wtf" && request.method === "POST") {
        const data = await request.json();
        const selectedAge = data.age;

        // BEZPEČNOSTNÍ KONTROLA: Je ten věk v našem seznamu?
        // Aby nám tam někdo neposlal skript nebo nesmysl.
        if (selectedAge && AGE_GROUPS.includes(selectedAge)) {
          
          // A) Celkové stažení
          let downloads = await env.STATS.get("downloads");
          downloads = parseInt(downloads || 0) + 1;
          await env.STATS.put("downloads", downloads.toString());

          // B) Konkrétní věk
          const ageKey = `age_${selectedAge}`;
          let ageCount = await env.STATS.get(ageKey);
          ageCount = parseInt(ageCount || 0) + 1;
          await env.STATS.put(ageKey, ageCount.toString());
          
          return new Response(JSON.stringify({ message: "Uloženo" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        return new Response("Neplatná data", { status: 400, headers: corsHeaders });
      }

      // -------------------------------------------------------------
      // 2. ADMIN ZÓNA (Chráněno heslem) 🛡️
      // -------------------------------------------------------------

      // Pokud chce někdo vidět STATS_NETFLIX nebo mazat, MUSÍ mít klíč
      if (url.pathname === "/stats" || url.pathname === "/delete") {
        
        // KONTROLA HESLA
        if (urlKey !== ADMIN_KEY) {
            return new Response(JSON.stringify({ error: "Přístup odepřen: Špatné heslo" }), { 
                status: 403, 
                headers: { ...corsHeaders, "Content-Type": "application/json" } 
            });
        }

        // A) Výpis statistik (jen když sedí heslo)
        if (url.pathname === "/stats") {
            const visits = await env.STATS.get("visits") || 0; // opraven nazev klice z predchoziho kodu
            const clicks = await env.STATS.get("login_clicks") || 0;
            const modalViews = await env.STATS.get("modal_views") || 0;
            const downloads = await env.STATS.get("downloads") || 0;

            const ageStats = {};
            for (const age of AGE_GROUPS) {
                const count = await env.STATS.get(`age_${age}`) || 0;
                ageStats[age] = count;
            }
            
            return new Response(JSON.stringify({ 
                visits, login_clicks: clicks, modal_views: modalViews, downloads, age_breakdown: ageStats 
            }, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // B) Smazání dat (jen když sedí heslo)
        if (url.pathname === "/delete") {
            // Smažeme vše
            await env.STATS.delete("visits");
            await env.STATS.delete("login_clicks");
            await env.STATS.delete("modal_views");
            await env.STATS.delete("downloads");
            for (const age of AGE_GROUPS) {
               await env.STATS.delete(`age_${age}`);
            }
            return new Response("Databáze bezpečně vymazána.", { headers: corsHeaders });
        }
      }

      return new Response("Not found", { status: 404, headers: corsHeaders });

    } catch (err) {
      return new Response("Error: " + err.message, { status: 500, headers: corsHeaders });
    }
  },
};