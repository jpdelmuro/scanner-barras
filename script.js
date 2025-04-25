document.addEventListener("DOMContentLoaded", () => {
    const resultEl = document.getElementById("barcode-result");
    const videoEl = document.getElementById("scanner-preview");
  
    // Configura esto según si quieres usar cámara frontal (true) o trasera (false)
    const isFrontCamera = false; // ← cambia a true si quieres la frontal
  
    // Aplica o quita el efecto espejo según el tipo de cámara
    if (isFrontCamera) {
      videoEl.style.transform = 'scaleX(-1)';
    } else {
      videoEl.style.transform = 'none';
    }
  
    Quagga.init({
      inputStream: {
        type: "LiveStream",
        constraints: {
          facingMode: isFrontCamera ? "user" : "environment",
        },
        target: document.querySelector('#scanner-container'),
      },
      decoder: {
        readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"],
      },
    }, function (err) {
      if (err) {
        console.error(err);
        alert("Error al iniciar la cámara.");
        return;
      }
      Quagga.start();
    });
  
    Quagga.onDetected(function (data) {
      const code = data.codeResult.code;
      resultEl.textContent = code;
  
      // Opcional: detener después de una lectura exitosa
      Quagga.stop();
      console.log("Código detectado:", code);
    });
  });
  