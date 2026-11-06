const form = document.getElementById("verificationForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const demoCode = document.getElementById("demoCode").value.trim();
  if (!/^Hacking-Arena\{[^{}\s]{1,64}\}$/.test(demoCode)) {
    message.textContent = "Bruk formatet Hacking-Arena{kode} (1–64 tegn uten mellomrom eller krøllparenteser).";
    message.style.color = "#b91c1c";
    return;
  }

  submitButton.disabled = true;
  message.textContent = "Kontrollerer testkode …";
  message.style.color = "#475569";

  try {
    const response = await fetch("/api/demo-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demoCode })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);

    message.textContent = "Den forhåndsgodkjente testkoden ble lagret i Supabase.";
    message.style.color = "#15803d";
    form.reset();
  } catch (error) {
    message.textContent = `Testkoden ble ikke lagret: ${error.message}`;
    message.style.color = "#b91c1c";
  } finally {
    submitButton.disabled = false;
  }
});
