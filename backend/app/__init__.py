import os
import certifi

from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
BASE_DIR = os.path.abspath(
    os.path.dirname(os.path.dirname(__file__))
)

load_dotenv(os.path.join(BASE_DIR, '.env'))

# Initialize extensions globally
mongo = PyMongo()
jwt = JWTManager()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)

    # Enable CORS
    CORS(app)

    # App Configuration
    app.config["MONGO_URI"] = (
        os.getenv("MONGO_URI")
        + "&tlsAllowInvalidCertificates=true"
    )
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    # IMPORTANT FIX FOR MONGODB SSL/TLS
    app.config["TLSCAFILE"] = certifi.where()

    # Initialize extensions
    mongo.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Register Blueprints
    from app.routes.auth import auth_bp

    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    # Base Route
    @app.route('/')
    def index():
        return "TRAVELMAiT Backend API is running!"

    return app