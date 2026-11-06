const form = document.getElementById("verificationForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const demoCode = document.getElementById("demoCode").value.trim();
  if (demoCode !== "DEMO-1234") {
    message.textContent = "Bruk kun testflagget DEMO-1234.";
    message.style.color = "#b91c1c";
    return;
  }

  submitButton.disabled = true;
  message.textContent = "Kontrollerer testflagget …";
  message.style.color = "#475569";

  try {
    const response = await fetch("/api/demo-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demoCode })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);

    message.textContent = "Testflagget ble registrert. Dette steget i demoen er fullført.";
    message.style.color = "#15803d";
    form.reset();
  } catch (error) {
    message.textContent = `Kunne ikke registrere testflagget: ${error.message}`;
    message.style.color = "#b91c1c";
  } finally {
    submitButton.disabled = false;
  }
});
