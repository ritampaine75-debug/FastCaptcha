const workerScript = `
self.onmessage = async function(e) {
  const { nonceSeed, prefix, maxIterations = 500000 } = e.data;
  const startTime = performance.now();
  let nonce = 0;
  const textEncoder = new TextEncoder();

  while (nonce < maxIterations) {
    const input = nonceSeed + nonce;
    const data = textEncoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    
    let hex = '';
    for (let i = 0; i < hashArray.length; i++) {
      hex += hashArray[i].toString(16).padStart(2, '0');
    }

    if (hex.startsWith(prefix)) {
      const durationMs = Math.round(performance.now() - startTime);
      self.postMessage({ success: true, nonce, hash: hex, durationMs, iterations: nonce + 1 });
      return;
    }

    nonce++;
    if (nonce % 5000 === 0) {
      self.postMessage({ type: 'PROGRESS', iterations: nonce });
    }
  }

  self.postMessage({ success: false, error: 'MAX_ITERATIONS' });
};
`;

export function solveProofOfWork(nonceSeed, prefix, onProgress) {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Worker && window.Blob) {
      try {
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);

        worker.onmessage = (event) => {
          if (event.data.type === 'PROGRESS') {
            if (onProgress) onProgress(event.data.iterations);
            return;
          }
          URL.revokeObjectURL(workerUrl);
          worker.terminate();
          resolve(event.data);
        };

        worker.onerror = () => {
          URL.revokeObjectURL(workerUrl);
          worker.terminate();
          fallbackMainThread(nonceSeed, prefix).then(resolve);
        };

        worker.postMessage({ nonceSeed, prefix });
        return;
      } catch (e) {}
    }
    fallbackMainThread(nonceSeed, prefix).then(resolve);
  });
}

async function fallbackMainThread(nonceSeed, prefix) {
  const startTime = performance.now();
  let nonce = 0;
  const textEncoder = new TextEncoder();

  while (nonce < 150000) {
    const input = nonceSeed + nonce;
    const data = textEncoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);

    let hex = '';
    for (let i = 0; i < hashArray.length; i++) {
      hex += hashArray[i].toString(16).padStart(2, '0');
    }

    if (hex.startsWith(prefix)) {
      return {
        success: true,
        nonce,
        hash: hex,
        durationMs: Math.round(performance.now() - startTime),
        iterations: nonce + 1
      };
    }
    nonce++;
    if (nonce % 250 === 0) {
      await new Promise(r => setTimeout(r, 0));
    }
  }

  return { success: false, nonce, hash: '', durationMs: Math.round(performance.now() - startTime) };
}
