from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
)
from flask_migrate import Migrate
from config import Config
from models import db, User
from itsdangerous import URLSafeTimedSerializer
import os

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not email or not password or len(password) < 6:
        return jsonify(message="Email and password (min 6 chars) required"), 400

    if User.query.filter_by(email=email).first():
        return jsonify(message="User already exists"), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password_hash=password_hash, role=role)
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error during signup: {e}")
        return jsonify(message="Database error during signup"), 500

    return jsonify(message="Signup successful"), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        token = create_access_token(identity={"email": user.email, "role": user.role})
        return jsonify(message="Login successful", access_token=token, role=user.role), 200
    return jsonify(message="Invalid credentials"), 401

@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify(logged_in_as=user), 200

@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    user = get_jwt_identity()
    if user["role"] == "admin":
        total_users = User.query.count()
        admin_count = User.query.filter_by(role="admin").count()
        return jsonify(totalUsers=total_users, adminCount=admin_count, role=user["role"]), 200
    else:
        student = User.query.filter_by(email=user["email"]).first()
        created_at_str = student.created_at.strftime('%Y-%m-%d %H:%M:%S') if student.created_at else None
        return jsonify(email=student.email, role=student.role, created_at=created_at_str), 200

@app.route("/reset-password-request", methods=["POST"])
def reset_password_request():
    data = request.get_json()
    email = data.get("email")
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(message="If an account with that email exists, a password reset link has been sent."), 200

    token = serializer.dumps(email, salt='password-reset-salt')
    print(f"Password reset token for {email}: {token}")
    return jsonify(message="Password reset link generated (check console/email)", token=token), 200

@app.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=3600)
        data = request.get_json()
        new_password = data.get("password")
        if not new_password or len(new_password) < 6:
            return jsonify(message="Password must be at least 6 characters"), 400
        
        user = User.query.filter_by(email=email).first()
        if user:
            user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
            db.session.commit()
            return jsonify(message="Password reset successful"), 200
        
        return jsonify(message="User not found"), 404
    except Exception as e:
        print(f"Password reset error: {e}")
        return jsonify(message="Invalid or expired token"), 400

@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify(message="Logged out successfully")
    return response, 200

if __name__ == "__main__":
    app.run(debug=True)