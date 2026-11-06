const form = document.getElementById("verificationForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const demoText = document.getElementById("demoCode").value.trim();
  if (!/^Hacking-Arena\{[^{}\s]{1,64}\}$/.test(demoText)) {
    message.textContent = "Bruk formatet Hacking-Arena{kode} (1–64 tegn uten mellomrom eller krøllparenteser).";
    message.style.color = "#b91c1c";
    return;
  }

  submitButton.disabled = true;
  message.textContent = "Registrerer testhendelse …";
  message.style.color = "#475569";

  try {
    // Testteksten sendes aldri til serveren, for å unngå å samle inn hemmeligheter.
    const response = await fetch("/api/demo-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testSubmitted: true })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);

    message.textContent = "Testhendelsen ble lagret i Supabase. Teksten ble ikke lagret.";
    message.style.color = "#15803d";
    form.reset();
  } catch (error) {
    message.textContent = `Kunne ikke registrere testhendelsen: ${error.message}`;
    message.style.color = "#b91c1c";
  } finally {
    submitButton.disabled = false;
  }
});
