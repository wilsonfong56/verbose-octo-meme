from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)
db = SQLAlchemy()
CORS(app, origins=["http://localhost:5173"])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
db.init_app(app)

@app.route("/", methods = ["GET"])
def index():
    return "Home"

if __name__ == "__main__":
    app.run(debug=True)