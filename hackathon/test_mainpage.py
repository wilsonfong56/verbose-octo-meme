from flask import Flask, request, redirect, url_for, session, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

app = Flask(__name__)
app.secret_key = "some-secret-key"
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

uri = os.getenv("MONGODB_URI")
client = MongoClient(uri, server_api=ServerApi('1'))
try:
    db = client["test"]
    user_collection = db["users"]
    notes_collection = db["notes"]
except Exception as e:
    print(e)

def getUserbyEmail(email):
    result = user_collection.find_one({"email": email})
    return result

@app.route("/getUser", methods = ["POST"])
def getUser():
    data = request.json
    email = data.get("email")

    user = getUserbyEmail(email)
    return jsonify(name=user['name'], role=user['role'])

@app.route("/signin", methods = ["GET", "POST"])
def login():

    if request.is_json:
        data = request.get_json()
        email = data.get('email')
        role = data.get('role')

        if email and role:
            session['email'] = email
            session['role'] = role
            user = {
                "email": email,
                "role": role
            }
            user_collection.insert_one(user)
            return jsonify({"success": True}), 200

        else:
            return jsonify({"success": False, "error": "Content-Type must be application/json"}), 415


    
    return "<p>Login page (used by frontend)</p>", 200


@app.route("/classlists", methods = ["GET"])
def main():
    email = session.get('email')
    role = session.get('role')
    if not email or not role:
        return jsonify({"error": "Unauthroized"}), 401
    
    return jsonify({
        "email": email,
        "role": role
    })


@app.route("/addNote", methods = ["POST"])
def addNote():
    data = request.json
    name = data.get("name")
    lecture = data.get("lecture")
    date = data.get("date")
    notebook = data.get("notebook") # json obj with topic and notes

    student_notebook = {
        "name": name,
        "Notebook": notebook
    }

    lecture_exists = notes_collection.find_one(
        {
            "lecture": lecture,
            "date": date
        }
    )

    if not lecture_exists:
        new_lecture = {
            "lecture": lecture,
            "date": date,
            "class_notes": [student_notebook]
        }
        notes_collection.insert_one(new_lecture)
    else:
        notes_collection.update_one(
            {"lecture": lecture, "date": date},
            { "$push": {"class_notes": student_notebook}}
        )
    return jsonify(message="Note added successfully")


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