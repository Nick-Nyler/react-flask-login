from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from flask_migrate import Migrate
from config import Config
from models import db, User

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not email or not password:
        return jsonify(message="Email and password required"), 400

    if User.query.filter_by(email=email).first():
        return jsonify(message="User already exists"), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password_hash=password_hash, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(message="Signup successful"), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        token = create_access_token(identity={"email": user.email, "role": user.role})
        return jsonify(message="Login successful", access_token=token), 200

    return jsonify(message="Invalid credentials"), 401

@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify(logged_in_as=user), 200

if __name__ == "__main__":
    app.run(debug=True)
