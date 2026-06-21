import sys
import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS

# Add parent directory of backend to sys.path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.config import Config
from backend.services.model_service import model_service
from backend.routes.predict import predict_bp


def create_app():
    app = Flask(__name__)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

    # Initialize config directories and validate model path
    Config.init_app()
    app.logger.info(f"Config loaded: PORT={Config.PORT}, DEBUG={Config.DEBUG}, MODEL_PATH={Config.MODEL_PATH}")
    if not os.path.exists(Config.MODEL_PATH):
        app.logger.error(f"Model file not found at {Config.MODEL_PATH}")

    try:
        model_service.load_model(Config.MODEL_PATH)
    except Exception as exc:
        app.logger.exception("Failed to load model during startup")

    # Register Blueprints
    app.register_blueprint(predict_bp)

    return app


app = create_app()


@app.errorhandler(404)
def handle_not_found(error):
    return jsonify({'error': 'Endpoint not found.'}), 404


@app.errorhandler(500)
def handle_server_error(error):
    return jsonify({'error': 'Internal server error.'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
