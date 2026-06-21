import os
import logging
import numpy as np

logger = logging.getLogger(__name__)


class ModelService:
    def __init__(self):
        self.model = None

    def load_model(self, model_path: str):
        if self.model is not None:
            logger.info("Model already loaded – skipping reload")
            return

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")

        logger.info("Loading TensorFlow model from %s …", model_path)

        # Import inside method so startup errors are clearly reported
        import tensorflow as tf  # noqa: F401

        self.model = tf.keras.models.load_model(model_path)
        logger.info(
            "[OK] Model loaded successfully.  Input shape: %s  Output shape: %s",
            self.model.input_shape,
            self.model.output_shape,
        )

        # ── WARM-UP PREDICTION ──────────────────────────────────────────────
        # TensorFlow's first prediction takes 10-30 seconds on slow CPUs
        # due to graph tracing/initialization. We run a dummy prediction
        # during startup so user requests don't hit Gunicorn's 30s timeout.
        logger.info("Running warmup prediction to initialize TensorFlow...")
        dummy_input = np.zeros((1, 28, 28, 1), dtype=np.float32)
        self.model.predict(dummy_input, verbose=0)
        logger.info("[OK] Warmup complete. Model is fully ready.")

    def predict(self, processed_img):
        if self.model is None:
            raise RuntimeError("Model is not loaded. Call load_model() first.")

        logger.info("model.predict() input shape: %s", processed_img.shape)
        prediction = self.model.predict(processed_img, verbose=0)
        logger.info("model.predict() output shape: %s  values: %s", prediction.shape, prediction)

        predicted_class = int(np.argmax(prediction[0]))
        confidence = float(np.max(prediction[0]))
        all_probs = [float(p) for p in prediction[0].tolist()]

        return predicted_class, confidence, all_probs


# Singleton instance used across the app
model_service = ModelService()
