import sys
import os
from flask import Flask
from flask_cors import CORS

# Add parent directory of backend to sys.path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.config import Config
from backend.services.model_service import model_service
from backend.routes.predict import predict_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Initialize config directories
    Config.init_app()
    
    # Load TensorFlow Keras Model once at startup
    try:
        model_service.load_model(Config.MODEL_PATH)
    except Exception as e:
        print(f"Error loading model at startup: {e}")
        
    # Register Blueprints
    app.register_blueprint(predict_bp)
    
    return app

app = create_app()

if __name__ == '__main__':
    # Start server
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
