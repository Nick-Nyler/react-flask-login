# React-Flask Authentication App

This is a full-stack application demonstrating user authentication (signup, login, logout, protected routes, dashboard) using React.js for the frontend and Flask with Flask-JWT-Extended for the backend.

## Features

- **User Authentication**: Secure signup and login with hashed passwords.
- **JWT (JSON Web Tokens)**: Stateless authentication and authorization.
- **Protected Routes**: Restrict access based on authentication status.
- **Role-Based Access Control (RBAC)**: Role-specific dashboard content.
- **Client-Side Validation**: Basic email and password validation.
- **Responsive Design**: Mobile-friendly layout using basic CSS.
- **Password Reset (Backend)**: Endpoint for requesting password reset token (email integration needed for real app).

## Technologies Used

### Frontend (React)
- React 18+
- React Router DOM v6
- Axios
- Basic CSS

### Backend (Flask)
- Python 3.x
- Flask
- Flask-CORS
- Flask-Bcrypt
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-Migrate
- SQLAlchemy
- itsdangerous

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js & npm (or yarn)

### 1. Backend Setup

```bash
git clone <repository_url>
cd react-flask-login/backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

- **Windows**: `.env\Scriptsctivate`
- **macOS/Linux**: `source venv/bin/activate`

Install dependencies:

```bash
pip install -r requirements.txt
```

If `requirements.txt` is missing, install manually:

```bash
pip install Flask Flask-CORS Flask-Bcrypt Flask-JWT-Extended Flask-SQLAlchemy Flask-Migrate SQLAlchemy itsdangerous
```

Create a `.env` file:

```
DATABASE_URL=sqlite:///users.db
JWT_SECRET_KEY=your_jwt_secret_key_here
SECRET_KEY=your_app_secret_key_here
FLASK_ENV=development
```

Initialize and migrate the database:

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

Seed the database (optional):

```bash
python seed.py
```

Run the backend server:

```bash
flask run
```

### 2. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

- The frontend runs at: `http://localhost:3000`
- The backend runs at: `http://localhost:5000`

## Usage

- **Signup**: `http://localhost:3000/signup`
- **Login**: `http://localhost:3000/`
- **Admin Login**: admin@example.com / admin123 (if seeded)
- **Student Login**: student@example.com / student123 (if seeded)
- **Dashboard**: Redirects after login, role-specific content
- **Protected Route**: Direct access to `/protected` redirects unauthenticated users
- **Logout**: Clears session

## Project Structure

```
.
├── backend/
│   ├── venv/
│   ├── migrations/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── seed.py
│   └── requirements.txt
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Dashboard.js
│   │   └── Protected.js
│   ├── package.json
│   └── .env
└── README.md
```

## Troubleshooting

- **CORS Error**: Ensure `Flask-CORS` is configured in `app.py`
- **Database Errors**: Run migrations after model changes
- **JWT Issues**: Expired/invalid tokens auto-logout users
- **Router Issues**: Wrap content in `<BrowserRouter>` in `App.js`