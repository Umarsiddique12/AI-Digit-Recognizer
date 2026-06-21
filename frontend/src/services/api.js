// Backend URL: set VITE_API_URL in .env (local) or Render env vars (production)
console.log('[DEBUG] import.meta.env.VITE_API_URL =', import.meta.env.VITE_API_URL);
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
console.log('[DEBUG] Computed API_URL =', API_URL);

/**
 * Sends a digit image blob to the Flask backend for prediction.
 * @param {Blob} blob - PNG image blob from canvas or file upload.
 * @returns {Promise<Object>} Prediction JSON: { prediction, confidence, all_probs }
 */
export const predictDigit = async (blob) => {
  console.log('[DEBUG] predictDigit called with blob size:', blob.size, 'type:', blob.type);
  const formData = new FormData();
  formData.append('image', blob, 'digit.png');
  console.log('[DEBUG] FormData created with image file.');

  let response;
  try {
    const targetUrl = `${API_URL}/predict`;
    console.log('[DEBUG] Attempting fetch POST to:', targetUrl);
    response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header manually — browser sets it with boundary
    });
    console.log('[DEBUG] fetch returned response. status:', response.status, response.statusText);
  } catch (networkErr) {
    console.error('[DEBUG] fetch caught a network error:', networkErr);
    // Covers: server down, CORS preflight blocked, network offline
    throw new Error(
      `Cannot reach backend at ${API_URL}. Is the server running? (${networkErr.message})`
    );
  }

  // Try to parse JSON body; fall back to status text if server sent HTML (e.g. 502)
  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(`Server error ${response.status}: ${text.slice(0, 200)}`);
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
};

/**
 * Ping the backend health endpoint.
 * @returns {Promise<Object>} { status, model_loaded }
 */
export const checkHealth = async () => {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
};
