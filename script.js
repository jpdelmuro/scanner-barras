document.addEventListener("DOMContentLoaded", async () => {
    const video = document.getElementById("video");
    const scanButton = document.getElementById("scan-button");
    const historyEl = document.getElementById("barcode-history");
    const scannedCodes = new Set();
  
    // Inicializa la cámara
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment"
        },
        audio: false
      });
      video.srcObject = stream;
      await video.play();
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara.");
      return;
    }
  
    // Escanea al hacer clic en el botón
    scanButton.addEventListener("click", () => {
      // Crear canvas temporal para capturar el fotograma actual del video
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
      // Ejecutar Quagga en modo single-image
      Quagga.decodeSingle({
        src: canvas.toDataURL(),
        numOfWorkers: 0,
        inputStream: {
          size: 800  // tamaño de imagen para análisis
        },
        decoder: {
          readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"]
        },
        locate: true
      }, (result) => {
        if (result && result.codeResult) {
          const code = result.codeResult.code;
          if (!scannedCodes.has(code)) {
            scannedCodes.add(code);
            const li = document.createElement("li");
            li.textContent = code;
            historyEl.appendChild(li);
            console.log("✅ Código detectado:", code);
          }
        } else {
          alert("No se detectó ningún código. Intenta enfocar mejor.");
          console.log("❌ No se detectó código");
        }
      });
    });
  });
  