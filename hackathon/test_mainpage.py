from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)
db = SQLAlchemy()
CORS(app, origins=["http://localhost:5173"])
#app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
#db.init_app(app)

@app.route("/signin", methods = ["GET", "POST"])
def login():

    if request.is_json:
        data = request.get_json()
        email = data.get('email')
        role = data.get('role')

        if email and role:
            session['email'] = email
            session['role'] = role
            return jsonify({"success": True}), 200

        else:
            return jsonify({"success": False, "error": "Content-Type must be application/json"}), 415
            #return jsonify({"success": False, "error": "Missing email or role"}), 400
    

    
    return "<p>Login page (used by frontend)</p>", 200


@app.route("/main", methods = ["GET"])
def main():
    email = session.get('email')
    role = session.get('role')
    if not email or not role:
        return jsonify({"error": "Unauthroized"}), 401
    
    return jsonify({
        "email": email,
        "role": role,
        "notes": notes
    })


@app.route("/addnotes", methods=["POST"])
def add_note():
    global next_id
    title = request.form.get("title").strip()
    content = request.form.get("content").strip()
    if title and content:
        notes.append({"id": next_id, "title": title, "content": content})
        next_id += 1
    elif title and content == "":
        notes.append({"id": next_id, "title": title, "content": "Empty content"})
        next_id += 1

    return redirect(url_for("index"))

@app.route("/delete/<int:note_id>", methods=["POST"])
def delete_note(note_id):
    global notes
    notes = [note for note in notes if note["id"] != note_id]
    return redirect(url_for("index"))

@app.route("/edit/<int:note_id>", methods=["POST"])
def edit_note(note_id):
    global notes
    notes = [note for note in notes if note["id"] != note_id]

if __name__ == "__main__":
    app.run(debug=True)