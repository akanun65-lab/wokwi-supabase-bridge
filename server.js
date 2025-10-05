import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const SUPABASE_URL = "https://emwkifrkrkkbtcfjajyy.supabase.co/rest/v1/wire_status";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtd2tpZnJrcmtrYnRjZmphanl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzY3NTksImV4cCI6MjA3MzMxMjc1OX0._2h6EJvb3uVx9nSdG9YZLIoS3m9A6CkEfBwGNS4-o3Y";

app.post("/update", async (req, res) => {
  try {
    const { wire_name, status, subsystem, temperature } = req.body;

    const response = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        wire_name,
        status,
        subsystem,
        temperature
      })
    });

    if (response.ok) {
      console.log("✅ Sent to Supabase:", req.body);
      res.status(200).send("OK");
    } else {
      const err = await response.text();
      console.error("🔴 Supabase error:", err);
      res.status(500).send(err);
    }
  } catch (err) {
    console.error("🔥 Server error:", err);
    res.status(500).send("Server error");
  }
});

app.listen(10000, () => console.log("🌐 Bridge running on port 10000"));
