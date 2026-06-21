import os
import logging
import tensorflow as tf
import numpy as np

logger = logging.getLogger(__name__)

class ModelService:
    def __init__(self):
        self.model = None

    def load_model(self, model_path):
        if self.model is not None:
            return

        if not os.path.exists(model_path):
            logger.error(f"Model file not found at {model_path}")
            raise FileNotFoundError(f"Model file not found at {model_path}")

        logger.info(f"Loading model from {model_path}")
        self.model = tf.keras.models.load_model(model_path)
        logger.info("Model loaded successfully.")

    def predict(self, processed_img):
        if self.model is None:
            logger.error("Prediction requested before model was loaded")
            raise RuntimeError("Model is not loaded.")

        prediction = self.model.predict(processed_img)
        predicted_class = int(np.argmax(prediction[0]))
        confidence = float(np.max(prediction[0]))
        all_probs = [float(p) for p in prediction[0].tolist()]

        return predicted_class, confidence, all_probs

# Instantiate singleton service
model_service = ModelService()
