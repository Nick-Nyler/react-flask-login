from app import app, db
from models import User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

with app.app_context():
    db.drop_all()
    db.create_all()

    admin_pw = bcrypt.generate_password_hash("admin123").decode('utf-8')
    student_pw = bcrypt.generate_password_hash("student123").decode('utf-8')

    admin = User(email="admin@example.com", password_hash=admin_pw, role="admin")
    student = User(email="student@example.com", password_hash=student_pw, role="student")

    db.session.add_all([admin, student])
    db.session.commit()
    print("✅ Test users created.")
