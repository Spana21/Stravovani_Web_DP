export default {
  async fetch(request, env) {
    // Definice věkových skupin (musí být stejné jako v Reactu)
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

    try {
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

      // --- NOVÉ: 4. Započítat konkrétní VĚK a STAŽENÍ ---
      // Tady používáme metodu POST, protože React nám posílá data (ten věk)
      if (url.pathname === "/wtf" && request.method === "POST") {
        const data = await request.json(); // Přečteme data od Reactu
        const selectedAge = data.age; // Např. "18 - 24"

        if (selectedAge) {
          // 1. Započítáme celkové stažení
          let downloads = await env.STATS.get("downloads");
          downloads = parseInt(downloads || 0) + 1;
          await env.STATS.put("downloads", downloads.toString());

          // 2. Započítáme konkrétní věkovou skupinu (klíč bude např. "age_18 - 24")
          const ageKey = `age_${selectedAge}`;
          let ageCount = await env.STATS.get(ageKey);
          ageCount = parseInt(ageCount || 0) + 1;
          await env.STATS.put(ageKey, ageCount.toString());
        }

        return new Response(JSON.stringify({ message: "Age tracked" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // 5. Statistiky (Upraveno, aby vypsalo i věk)
      if (url.pathname === "/stats") {
        const visits = await env.STATS.get("visits") || 0;
        const clicks = await env.STATS.get("login_clicks") || 0;
        const modalViews = await env.STATS.get("modal_views") || 0;
        const downloads = await env.STATS.get("downloads") || 0;

        // Načteme statistiky pro každou věkovou skupinu
        const ageStats = {};
        for (const age of AGE_GROUPS) {
          const count = await env.STATS.get(`age_${age}`) || 0;
          ageStats[age] = count;
        }
        
        return new Response(JSON.stringify({ 
          visits, 
          login_clicks: clicks, 
          modal_views: modalViews,
          downloads_total: downloads,
          age_breakdown: ageStats // Tady bude rozpis věku
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 6. Vymazat databázi
      if (url.pathname === "/delete") {
        // Musíme smazat všechno, včetně věkových skupin
        await env.STATS.put("visits", "0");
        await env.STATS.put("login_clicks", "0");
        await env.STATS.put("modal_views", "0");
        await env.STATS.put("downloads", "0");
        
        for (const age of AGE_GROUPS) {
           await env.STATS.put(`age_${age}`, "0");
        }

        return new Response(JSON.stringify({ message: "Vše vymazáno" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response("Not found", { status: 404, headers: corsHeaders });

    } catch (err) {
      return new Response("Error: " + err.message, { status: 500, headers: corsHeaders });
    }
  },
};