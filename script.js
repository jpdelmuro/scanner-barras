document.addEventListener("DOMContentLoaded", async () => {
    const video = document.getElementById("video");
    const historyEl = document.getElementById("barcode-history");
    const scannedCodes = new Set(); // Para evitar duplicados
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment" // o "user" para frontal
        },
        audio: false
      });
  
      video.srcObject = stream;
  
      video.onloadedmetadata = () => {
        video.play();
  
        Quagga.init({
          inputStream: {
            type: "LiveStream",
            target: video,
            constraints: {
              facingMode: "environment"
            }
          },
          locator: {
            patchSize: "medium",
            halfSample: true
          },
          numOfWorkers: navigator.hardwareConcurrency || 4,
          decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"]
          },
          locate: true
        }, (err) => {
          if (err) {
            console.error("Error al iniciar Quagga:", err);
            return;
          }
          Quagga.start();
        });
  
        Quagga.onDetected((data) => {
          const code = data.codeResult.code;
  
          if (!scannedCodes.has(code)) {
            scannedCodes.add(code);
  
            const li = document.createElement("li");
            li.textContent = code;
            historyEl.appendChild(li);
  
            console.log("Código detectado:", code);
          }
        });
      };
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara.");
    }
  });
  