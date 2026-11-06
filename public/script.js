const form = document.getElementById("verificationForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const demoCode = document.getElementById("demoCode").value.trim();
  if (demoCode !== "DEMO-1234") {
    message.textContent = "Bruk bare den oppgitte testkoden DEMO-1234.";
    message.style.color = "#b91c1c";
    return;
  }

  submitButton.disabled = true;
  message.textContent = "Lagrer testhendelse ...";
  message.style.color = "#334155";

  try {
    const response = await fetch("/api/demo-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demoCode })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);

    message.textContent = "Vellykket! En testhendelse ble lagret i Supabase.";
    message.style.color = "#15803d";
    form.reset();
  } catch (error) {
    message.textContent = `Kunne ikke lagre testhendelsen: ${error.message}`;
    message.style.color = "#b91c1c";
  } finally {
    submitButton.disabled = false;
  }
});
