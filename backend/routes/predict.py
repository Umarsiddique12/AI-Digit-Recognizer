import sys
from flask import Blueprint, request, jsonify, current_app
from backend.services.model_service import model_service
from backend.utils.preprocess import preprocess_image

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    if 'image' not in request.files:
        current_app.logger.warning('Predict request missing image field')
        return jsonify({'error': 'No image provided. Please send multipart/form-data with field name "image".'}), 400

    file = request.files['image']
    if file.filename == '':
        current_app.logger.warning('Predict request received empty filename')
        return jsonify({'error': 'Uploaded file must have a filename.'}), 400

    try:
        img_bytes = file.read()
        current_app.logger.info(f"Predict request received: filename={file.filename}, size={len(img_bytes)} bytes")

        processed_img = preprocess_image(img_bytes)
        predicted_class, confidence, all_probs = model_service.predict(processed_img)

        return jsonify({
            'prediction': predicted_class,
            'confidence': confidence,
            'all_probs': all_probs
        })
    except Exception as exc:
        current_app.logger.exception('Prediction failure')
        return jsonify({'error': f'Prediction failed: {exc}'}), 500
