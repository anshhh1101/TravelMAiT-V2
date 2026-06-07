import os
import certifi

from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_cors import CORS

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(os.path.join(BASE_DIR, '.env'))

mongo  = PyMongo()
jwt    = JWTManager()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)

    CORS(app)

    app.config["MONGO_URI"]        = os.getenv("MONGO_URI") + "&tlsAllowInvalidCertificates=true"
    app.config["JWT_SECRET_KEY"]   = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = __import__('datetime').timedelta(days=7)
    app.config["TLSCAFILE"]        = certifi.where()

    mongo.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Blueprints
    from app.routes.auth      import auth_bp
    from app.routes.chat      import chat_bp
    from app.routes.itinerary import itinerary_bp

    app.register_blueprint(auth_bp,      url_prefix="/api/auth")
    app.register_blueprint(chat_bp,      url_prefix="/api")
    app.register_blueprint(itinerary_bp, url_prefix="/api")

    @app.route('/')
    def index():
        return "TRAVELMAiT Backend API is running!"

    return app