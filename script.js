let lastResults = [];
const maxBuffer = 5;
const matchThreshold = 3;

Quagga.onDetected((data) => {
  const code = data.codeResult.code;

  // Añadir a buffer
  lastResults.push(code);
  if (lastResults.length > maxBuffer) {
    lastResults.shift(); // mantener el buffer en tamaño fijo
  }

  // Contar cuántas veces se repite el mismo código en el buffer
  const occurrences = lastResults.filter(c => c === code).length;

  // Solo lo agregamos al historial si se detectó múltiples veces
  if (occurrences >= matchThreshold && !scannedCodes.has(code)) {
    scannedCodes.add(code);

    const li = document.createElement("li");
    li.textContent = code;
    historyEl.appendChild(li);

    console.log("✅ Código validado:", code);
  } else {
    console.log("❌ Código inestable o duplicado:", code);
  }
});
