export default {
  async fetch(request, env) {
    const ADMIN_KEY = env.ADMIN_SECRET;

    const AGE_GROUPS = [
      "17 let nebo méně", "18 - 24", "25 - 34", "35 - 44",
      "45 - 54", "55 - 64", "65 a více"
    ];

    // --- CORS HLAVIČKY (Oprava tvé chyby v prohlížeči) ---
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 1. ZÁCHRANA PRO CORS (OPTIONS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const urlKey = url.searchParams.get("key");

    async function incrementCounter(key) {
      let val = await env.STATS.get(key);
      val = parseInt(val || 0) + 1;
      await env.STATS.put(key, val.toString());
      return val;
    }

    try {
      const schoolParam = url.searchParams.get("school") || "nezadano";

      // --- STATISTIKA NÁVŠTĚVNOSTI (GET) ---
      if (url.pathname === "/visit") {
        const total = await incrementCounter(`${schoolParam}_návštěvnost`);
        return new Response(JSON.stringify({ total }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // --- KLIKNUTÍ NA PŘIHLÁŠENÍ (POST) - BEZ TURNSTILE ---
      if (url.pathname === "/track-login-click" && request.method === "POST") {
        const data = await request.json();
        const selectedSchool = data.school || schoolParam;

        const total = await incrementCounter(`${selectedSchool}_kliknutí_tlačítka`);
        return new Response(JSON.stringify({ success: true, total }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // --- ZOBRAZENÍ EDU OKNA (GET) ---
      if (url.pathname === "/track-modal-view") {
        const total = await incrementCounter(`${schoolParam}_zobrazení_EduOkna`);
        return new Response(JSON.stringify({ total }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // --- ULOŽENÍ VĚKU A DOKONČENÍ (POST) ---
      if (url.pathname === "/wtf" && request.method === "POST") {
        const data = await request.json();
        const selectedAge = data.age;
        const selectedSchool = data.school || "nezadano"; 

        if (selectedAge && AGE_GROUPS.includes(selectedAge)) {
          await incrementCounter(`${selectedSchool}_downloads`);
          await incrementCounter(`${selectedSchool}_věk_${selectedAge}`);
          return new Response(JSON.stringify({ message: "Uloženo" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        return new Response("Neplatná data", { status: 400, headers: corsHeaders });
      }

      // --- ADMIN ZÓNA ---
      if (url.pathname === "/stats" || url.pathname === "/delete") {
        if (urlKey !== ADMIN_KEY) {
            return new Response(JSON.stringify({ error: "Špatné heslo" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        if (url.pathname === "/stats") {
            const list = await env.STATS.list();
            const result = {};

            for (const keyObj of list.keys) {
                const key = keyObj.name;
                const val = parseInt(await env.STATS.get(key) || 0);

                const firstUnderscore = key.indexOf('_');
                if (firstUnderscore === -1) continue; 

                const school = key.substring(0, firstUnderscore);
                const metric = key.substring(firstUnderscore + 1);

                if (!result[school]) {
                    result[school] = {
                        návštěvnost: 0, kliknutí_tlačítka: 0, zobrazení_EduOkna: 0, downloads: 0, age_breakdown: {}
                    };
                    AGE_GROUPS.forEach(a => result[school].age_breakdown[a] = 0);
                }

                if (metric.startsWith("věk_")) {
                    const ageStr = metric.replace("věk_", "");
                    result[school].age_breakdown[ageStr] = val;
                } else if (["návštěvnost", "kliknutí_tlačítka", "zobrazení_EduOkna", "downloads"].includes(metric)) {
                    result[school][metric] = val;
                }
            }
            
            return new Response(JSON.stringify(result, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        if (url.pathname === "/delete") {
            const list = await env.STATS.list();
            for (const keyObj of list.keys) {
                await env.STATS.delete(keyObj.name);
            }
            return new Response("Databáze vymazána.", { headers: corsHeaders });
        }
      }

      return new Response("Not found", { status: 404, headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
  }
};