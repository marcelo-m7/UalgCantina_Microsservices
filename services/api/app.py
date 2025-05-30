from flask import Flask, request, jsonify, g
from sqlalchemy.orm import scoped_session, sessionmaker
from firebase_admin import credentials, auth, initialize_app
from db import engine, Base
from models import User, Allergen, Dish, Week, DayMenu, MenuEntry
import config, auth as auth_utils

app = Flask(__name__)
Session = scoped_session(sessionmaker(bind=engine))

# Firebase init (one‑liner)
initialize_app(credentials.Certificate({
    "type": "service_account",
    "project_id": config.FIREBASE_PROJECT_ID,
    "private_key_id": config.FIREBASE_PRIVATE_KEY_ID,
    "private_key": config.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
    "client_email": config.FIREBASE_CLIENT_EMAIL,
    "token_uri": "https://oauth2.googleapis.com/token"
}))

@app.before_request
def create_session():
    g.db = Session()

@app.teardown_request
def remove_session(exc):
    Session.remove()

# ------------------- ROUTES -------------------
@app.route('/api/v1/allergens', methods=['GET'])
def get_allergens():
    data = g.db.query(Allergen).all()
    return jsonify([a.to_dict() for a in data])

@app.route('/api/v1/dishes', methods=['GET'])
def get_dishes():
    q = "SELECT * FROM vw_dishes_allergens"  # view definida em init.sql
    rows = g.db.execute(q).mappings().all()
    return jsonify(rows)

@app.route('/api/v1/menus/public/weekly', methods=['GET'])
def get_weekly_menu():
    rows = g.db.execute("SELECT * FROM vw_weekly_menu ORDER BY date, meal_type").mappings().all()
    return jsonify(rows)

# Admin‑only CRUD (exemplo Users)
@app.route('/api/v1/users', methods=['POST'])
@auth_utils.require_admin
def create_user():
    body = request.json
    user = User(name=body['name'], email=body['email'], role=body.get('role', 'editor'))
    g.db.add(user)
    g.db.commit()
    return jsonify(user.to_dict()), 201

if __name__ == '__main__':
    app.run(debug=True)