import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Bare POST er tillatt" });
  }

  // Bare den ufarlige testkoden lagres. Ikke bruk ekte passord, flagg eller andre hemmeligheter.
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Ugyldig JSON" });
  }
  if (!body || body.demoCode !== "DEMO-1234") {
    return res.status(400).json({ error: "Bruk testkoden DEMO-1234" });
  }

  const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    return res.status(500).json({ error: "Supabase-variablene mangler på serveren" });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    const { error } = await supabase.from("demo_events").insert({
      event_type: "demo_submitted",
      demo_code: body.demoCode
    });
    if (error) {
      console.error("Supabase-insert feilet:", error.message);
      return res.status(500).json({ error: "Supabase kunne ikke lagre testhendelsen" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Serverfeil:", error);
    return res.status(500).json({ error: "Intern serverfeil" });
  }
}
