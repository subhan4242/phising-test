import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Bare POST er tillatt" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Ugyldig JSON" });
  }

  // Only allow one pre-approved demo value configured privately by the owner.
  // A visitor cannot use this endpoint to store arbitrary credentials or flags.
  const demoCode = body?.demoCode;
  if (typeof demoCode !== "string" ||
      !/^Hacking-Arena\{[^{}\s]{1,64}\}$/.test(demoCode) ||
      Object.keys(body).length !== 1) {
    return res.status(400).json({ error: "Ugyldig testkodeformat" });
  }
  const { SUPABASE_URL, SUPABASE_SECRET_KEY, ALLOWED_DEMO_CODE } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !ALLOWED_DEMO_CODE) {
    return res.status(500).json({ error: "Miljøvariabler mangler på serveren" });
  }
  if (demoCode !== ALLOWED_DEMO_CODE) {
    return res.status(400).json({ error: "Dette er ikke en forhåndsgodkjent testkode" });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    const { error } = await supabase.from("demo_events").insert({
      event_type: "demo_submitted",
      demo_code: ALLOWED_DEMO_CODE
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
