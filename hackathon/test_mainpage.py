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
print(uri)
client = MongoClient(uri, server_api=ServerApi('1'))
try:
    db = client["test"]
    user_collection = db["users"]
    notes_collection = db["notes"]
except Exception as e:
    print(e)

def getUserbyEmail(email):
    print("Getting from user DB: ", email)
    result = user_collection.find_one({"email": email})
    return result

@app.route("/getUser", methods = ["POST"])
def getUser():
    data = request.json
    email = data.get("email") or session.get("email")

    if not email:
        return jsonify({"error": "Email not provided"}), 400

    user = getUserbyEmail(email)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(name=user['email'], role=user['role'])

@app.route("/signin", methods = ["GET", "POST"])
def login():

    if request.method == "POST":
        if request.is_json:
            try:
                data = request.get_json()
                print(f"Received JSON: {data}")
                
                email = data.get('email')
                role = data.get('role')

                if email and role:
                    session['email'] = email
                    session['role'] = role

                    user_exists = user_collection.find_one({"email": email})
                    if not user_exists:
                        user = {
                            "email": email,
                            "role": role
                        }
                        user_collection.insert_one(user)

                    return jsonify({"success": True}), 200
                else:
                    return jsonify({"success": False, "error": "Missing email or role"}), 400

            except Exception as e:
                print(f"Error during login: {e}")
                return jsonify({"success": False, "error": "Internal server error"}), 500
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

@app.route("/getNote", methods=["POST"])
def get_note():
    data = request.json
    lecture = data.get("lecture")
    date = data.get("date")

    if not lecture or not date:
        return jsonify({"error": "Missing lecture or date"}), 400

    try:
        lecture_doc = notes_collection.find_one({
            "lecture": lecture,
            "date": date
        })

        if not lecture_doc:
            return jsonify({"class_notes": []})

        return jsonify({
            "class_notes": lecture_doc.get("class_notes", [])
        })

    except Exception as e:
        print(f"Error fetching notes: {e}")
        return jsonify({"error": "Server error"}), 500


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

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True}), 200



if __name__ == "__main__":
    app.run(debug=True, port=5050)