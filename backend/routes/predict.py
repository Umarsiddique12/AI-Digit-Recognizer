from flask import Blueprint, request, jsonify
from backend.services.model_service import model_service
from backend.utils.preprocess import preprocess_image

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided.'}), 400

    file = request.files['image']

    try:
        img_bytes = file.read()
        processed_img = preprocess_image(img_bytes)

        predicted_class, confidence, all_probs = model_service.predict(processed_img)

        return jsonify({
            'prediction': predicted_class,
            'confidence': confidence,
            'all_probs': all_probs
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
