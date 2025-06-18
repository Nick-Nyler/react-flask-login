from app import app, db
from models import User
from flask_bcrypt import Bcrypt
import os

bcrypt_instance = Bcrypt()

with app.app_context():
    
    if os.environ.get('FLASK_ENV') == 'development' or app.config.get('DEBUG'):
        print(f"Running seed script in {os.environ.get('FLASK_ENV', 'production')} environment.")
        confirm = input("Drop all tables? (yes/no): ")
        if confirm.lower() == 'yes':
            db.drop_all()
            print("🗑️ All tables dropped.")
        
        db.create_all()
        print("🛠️ All tables created.")

        if not User.query.filter_by(email="admin@example.com").first():
            admin_pw = bcrypt_instance.generate_password_hash("admin123").decode('utf-8')
            student_pw = bcrypt_instance.generate_password_hash("student123").decode('utf-8')

            admin = User(email="admin@example.com", password_hash=admin_pw, role="admin")
            student = User(email="student@example.com", password_hash=student_pw, role="student")

            try:
                db.session.add_all([admin, student])
                db.session.commit()
                print("✅ Test users created: admin@example.com, student@example.com")
            except Exception as e:
                db.session.rollback()
                print(f"❌ Error creating test users: {e}")
        else:
            print("ℹ️ Test users already exist. Skipping creation.")
    else:
        print("Skipping seed script in non-development environment.")