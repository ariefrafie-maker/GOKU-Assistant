const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin"
});

export default {
  async fetch(request, env) {
    const allowedOrigin = "https://ariefrafie-maker.github.io";
    const origin = request.headers.get("Origin") || "";
    if (origin !== allowedOrigin) return new Response("Origin tidak diizinkan", { status: 403 });
    const cors = corsHeaders(allowedOrigin);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return Response.json({ error: "Gunakan POST." }, { status: 405, headers: cors });
    if (!env.GROQ_API_KEY || !env.GOKU_ACCESS_CODE) {
      return Response.json({ error: "Server belum dikonfigurasi. Lengkapi GROQ_API_KEY dan GOKU_ACCESS_CODE di Cloudflare." }, { status: 503, headers: cors });
    }
    const auth = request.headers.get("Authorization") || "";
    if (auth !== `Bearer ${env.GOKU_ACCESS_CODE}`) {
      return Response.json({ error: "Kode akses GOKU tidak cocok." }, { status: 401, headers: cors });
    }

    const length = Number(request.headers.get("Content-Length") || 0);
    if (length > 32000) return Response.json({ error: "Pesan terlalu besar." }, { status: 413, headers: cors });

    let body;
    try { body = await request.json(); }
    catch { return Response.json({ error: "Format permintaan tidak valid." }, { status: 400, headers: cors }); }

    const message = typeof body.message === "string" ? body.message.trim().slice(0, 6000) : "";
    if (!message) return Response.json({ error: "Pesan masih kosong." }, { status: 400, headers: cors });

    const lang = ["id", "palembang", "mix"].includes(body.language) ? body.language : "id";
    const history = Array.isArray(body.history) ? body.history.slice(-10).filter(x =>
      x && ["user", "assistant"].includes(x.role) && typeof x.content === "string"
    ).map(x => ({ role: x.role, content: x.content.slice(0, 4000) })) : [];

    const languageInstruction = lang === "palembang"
      ? "Gunakan Baso Palembang yang alami dan sopan. Jika istilah teknis lebih jelas dalam Bahasa Indonesia, pertahankan istilah teknisnya."
      : lang === "mix"
      ? "Gunakan Bahasa Indonesia yang natural dengan sisipan Baso Palembang secukupnya."
      : "Gunakan Bahasa Indonesia yang jelas, ramah, dan natural.";

    const system = `Anda adalah GOKU, asisten pribadi Arief. ${languageInstruction}
Bantu produktivitas, penjelasan, dan pekerjaan SHE/K3LH seperti HIRADC, JSA, SOP, inspeksi, investigasi insiden, dan pelatihan. Untuk regulasi, standar, angka, atau informasi terbaru, nyatakan bila perlu verifikasi sumber resmi dan jangan mengarang nomor pasal atau ketentuan. Jangan pernah mengaku dapat mengendalikan HP/laptop, menghapus virus, memasang aplikasi, atau melakukan tindakan di luar kemampuan nyata. Jangan meminta atau menampilkan password, API key, PIN, atau data rahasia. Berikan langkah pemecahan masalah yang aman, runtut, dan mudah diikuti. Jika tidak yakin, katakan terus terang. Jawab ringkas tetapi lengkap.`;

    try {
      const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [{ role: "system", content: system }, ...history, { role: "user", content: message }],
          temperature: 0.6,
          max_completion_tokens: 1200
        })
      });
      const data = await upstream.json().catch(() => ({}));
      if (!upstream.ok) {
        const status = upstream.status === 429 ? 429 : 502;
        return Response.json({ error: upstream.status === 429 ? "Kuota gratis Groq sedang mencapai batas. Coba lagi beberapa saat atau setelah kuota harian pulih." : "Layanan AI sedang bermasalah. Coba lagi nanti.", providerStatus: upstream.status }, { status, headers: cors });
      }
      const reply = data.choices?.[0]?.message?.content;
      if (!reply || typeof reply !== "string") throw new Error("Respons AI kosong");
      return Response.json({ reply }, { headers: { ...cors, "Cache-Control": "no-store" } });
    } catch {
      return Response.json({ error: "GOKU tidak dapat terhubung ke layanan AI. Periksa konfigurasi server dan koneksi internet." }, { status: 502, headers: cors });
    }
  }
};
