import os
import logging
import sys

# ── Ensure the repo root (parent of backend/) is on sys.path so that
#    "from backend.xxx import yyy" always works regardless of how gunicorn
#    or python invokes this module.
_HERE = os.path.dirname(os.path.abspath(__file__))          # …/dl_mini/backend
_ROOT = os.path.dirname(_HERE)                               # …/dl_mini
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

from flask import Flask, jsonify
from flask_cors import CORS

from backend.config import Config
from backend.services.model_service import model_service
from backend.routes.predict import predict_bp

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


def create_app() -> Flask:
    app = Flask(__name__)

    # ── CORS ─────────────────────────────────────────────────────────────────
    # Allow all origins so both localhost dev and the Render frontend work.
    # Change origins to a list of allowed URLs in production if you want
    # to tighten security.
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=False,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "OPTIONS"],
    )

    # Ensure CORS headers are always present (belt-and-suspenders for proxies)
    @app.after_request
    def _add_cors(response):
        response.headers.setdefault("Access-Control-Allow-Origin", "*")
        response.headers.setdefault(
            "Access-Control-Allow-Methods", "GET, POST, OPTIONS"
        )
        response.headers.setdefault(
            "Access-Control-Allow-Headers", "Content-Type, Authorization"
        )
        return response

    # ── Config & dirs ─────────────────────────────────────────────────────────
    Config.init_app()
    logger.info(
        "Config loaded: PORT=%s  DEBUG=%s  MODEL_PATH=%s",
        Config.PORT,
        Config.DEBUG,
        Config.MODEL_PATH,
    )

    # ── Model loading ─────────────────────────────────────────────────────────
    if not os.path.exists(Config.MODEL_PATH):
        logger.error("[ERROR] Model file NOT FOUND at %s", Config.MODEL_PATH)
        logger.error("  Render requires mnist_model.h5 to be committed to git.")
    else:
        logger.info("[OK] Model file found at %s", Config.MODEL_PATH)
        try:
            model_service.load_model(Config.MODEL_PATH)
        except Exception:
            logger.exception("[ERROR] Failed to load model during startup - predictions will fail")

    # ── Blueprints ────────────────────────────────────────────────────────────
    app.register_blueprint(predict_bp)

    # ── Health endpoints ──────────────────────────────────────────────────────
    @app.route("/", methods=["GET"])
    def root():
        return jsonify({"status": "healthy"}), 200

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "healthy",
            "model_loaded": model_service.model is not None,
        }), 200

    # ── Generic error handlers ────────────────────────────────────────────────
    @app.errorhandler(404)
    def _not_found(error):
        return jsonify({"success": False, "error": "Endpoint not found."}), 404

    @app.errorhandler(405)
    def _method_not_allowed(error):
        return jsonify({"success": False, "error": "Method not allowed."}), 405

    @app.errorhandler(500)
    def _server_error(error):
        return jsonify({"success": False, "error": "Internal server error."}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)
