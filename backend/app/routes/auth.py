from flask import Blueprint, request, jsonify
from app import mongo
from app.utils.auth_helpers import hash_password, verify_password
from flask_jwt_extended import create_access_token
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Extract data
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if user already exists
    existing_user = mongo.db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "User with this email already exists"}), 409

    # Create new user document
    new_user = {
        "name": name,
        "email": email,
        "password_hash": hash_password(password),
        "preference_vector": [],
        "preference_profile": {},
        "created_at": datetime.datetime.utcnow()
    }

    # Insert into MongoDB
    result = mongo.db.users.insert_one(new_user)

    return jsonify({"message": "User registered successfully", "user_id": str(result.inserted_id)}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    # Find user in database
    user = mongo.db.users.find_one({"email": email})
    
    if not user or not verify_password(user['password_hash'], password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT Token
    access_token = create_access_token(identity=str(user['_id']))

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email']
        }
    }), 200