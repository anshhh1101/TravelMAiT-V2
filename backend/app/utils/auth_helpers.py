from app import bcrypt

def hash_password(password):
    """Hashes a plaintext password using bcrypt."""
    return bcrypt.generate_password_hash(password).decode('utf-8')

def verify_password(hashed_password, password):
    """Verifies a plaintext password against a hashed password."""
    return bcrypt.check_password_hash(hashed_password, password)