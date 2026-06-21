import logging
from flask import Blueprint, request, jsonify, current_app

from backend.services.model_service import model_service
from backend.utils.preprocess import preprocess_image

logger = logging.getLogger(__name__)
predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    # ── Preflight ─────────────────────────────────────────────────────────────
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    logger.info(
        "POST /predict  |  Content-Type: %s  |  Content-Length: %s",
        request.content_type,
        request.content_length,
    )
    logger.info("Request headers: %s", dict(request.headers))

    # ── Model guard ───────────────────────────────────────────────────────────
    if model_service.model is None:
        logger.error("Model not loaded – cannot serve prediction")
        return jsonify({"success": False, "error": "Model not loaded on server."}), 503

    # ── File guard ────────────────────────────────────────────────────────────
    if "image" not in request.files:
        logger.warning("Request missing 'image' field in form-data")
        return jsonify({
            "success": False,
            "error": 'No image provided. Send multipart/form-data with field name "image".',
        }), 400

    file = request.files["image"]
    logger.info("Received file: filename=%s  mimetype=%s", file.filename, file.mimetype)

    if file.filename == "":
        return jsonify({"success": False, "error": "Uploaded file has no filename."}), 400

    # ── Preprocessing → Prediction ────────────────────────────────────────────
    try:
        img_bytes = file.read()
        logger.info("File size: %d bytes", len(img_bytes))

        logger.info("Running image preprocessing …")
        processed_img = preprocess_image(img_bytes)
        logger.info("Preprocessed tensor shape: %s", processed_img.shape)

        logger.info("Running model.predict() …")
        predicted_class, confidence, all_probs = model_service.predict(processed_img)
        logger.info(
            "Prediction result: class=%d  confidence=%.4f", predicted_class, confidence
        )

        return jsonify({
            "success": True,
            "prediction": predicted_class,
            "confidence": confidence,
            "all_probs": all_probs,
        }), 200

    except Exception as exc:
        logger.exception("Prediction pipeline failed")
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(exc)}",
        }), 500
