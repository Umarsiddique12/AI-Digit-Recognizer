// Backend URL: set VITE_API_URL in .env (local) or Render env vars (production)
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

/**
 * Sends a digit image blob to the Flask backend for prediction.
 * @param {Blob} blob - PNG image blob from canvas or file upload.
 * @returns {Promise<Object>} Prediction JSON: { prediction, confidence, all_probs }
 */
export const predictDigit = async (blob) => {
  const formData = new FormData();
  formData.append('image', blob, 'digit.png');

  let response;
  try {
    response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header manually — browser sets it with boundary
    });
  } catch (networkErr) {
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
