import os

class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.path.join(BASE_DIR, 'model', 'mnist_model.h5')
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    LOG_FOLDER = os.path.join(BASE_DIR, 'logs')
    PORT = int(os.environ.get('PORT', 5000))
    DEBUG = os.environ.get('FLASK_ENV') == 'development'

    # Ensure folders exist
    @classmethod
    def init_app(cls):
        os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(cls.LOG_FOLDER, exist_ok=True)
        os.makedirs(os.path.dirname(cls.MODEL_PATH), exist_ok=True)
