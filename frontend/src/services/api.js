const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Sends a digit image blob to the Flask backend for prediction.
 * @param {Blob} blob - The image blob (PNG format) from the canvas or uploaded file.
 * @returns {Promise<Object>} The prediction JSON response.
 */
export const predictDigit = async (blob) => {
  const formData = new FormData();
  formData.append('image', blob, 'digit.png');

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Prediction request failed.');
  }

  return await response.json();
};
