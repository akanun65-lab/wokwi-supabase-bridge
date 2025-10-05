import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Read Supabase config from environment variables (set these in Render)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_API_KEY) {
  console.warn("Warning: SUPABASE_URL or SUPABASE_API_KEY not set in environment!");
}

app.post("/update", async (req, res) => {
  try {
    const payload = req.body;
    console.log("📥 Received from Wokwi:", payload);

    // Supabase REST accepts an array for upsert; wrap payload
    const body = JSON.stringify([payload]);

    const supaUrl = `${SUPABASE_URL}?on_conflict=wire_name`;
    const r = await fetch(supaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_API_KEY,
        "Authorization": `Bearer ${SUPABASE_API_KEY}`,
        // Prefer merge-duplicates so existing rows are updated (upsert)
        "Prefer": "resolution=merge-duplicates,return=minimal"
      },
      body
    });

    const text = await r.text();
    console.log("📤 Supabase response:", r.status, text);
    res.status(200).json({ ok: true, supabaseStatus: r.status, supabaseBody: text });
  } catch (err) {
    console.error("❌ Bridge error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.send("Wokwi → Supabase bridge is running"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Bridge listening on ${PORT}`));
