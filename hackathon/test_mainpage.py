from flask import Flask, request, redirect, url_for, session, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
from openai import OpenAI


load_dotenv()

app = Flask(__name__)
app.secret_key = "some-secret-key"
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
api_key = os.getenv("OPENAPI_API_KEY")
uri = os.getenv("MONGODB_URI")
print(uri)
client = MongoClient(uri, server_api=ServerApi('1'))
llm = OpenAI(
    api_key=api_key,
)

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

@app.route("/getSummary", methods = ["POST"])
def getSummary():
    data = request.json
    lecture = data.get("lecture")
    date = data.get("date")

    notes = notes_collection.find_one({"lecture": lecture, "date": date})
    system_prompt = """
                    You are a notes summarizer that combines multiple students' notes on a topic into a single, logically ordered summary. 
                    Correct any mistakes and ensure clarity. Do not include any concluding statements or summaries at the end. 
                    Focus on just the facts and concepts. Group similar notes together into subtopics.
                    
                    Return your answer in the following format:
                    
                    {
                      "Notebooks": [
                        {
                          "topic": "Search and Sorting Algorithms",
                          "notes": [
                            "Binary search requires a sorted array and efficiently narrows down possibilities, resulting in a time complexity of O(log n)",
                            "Merge sort is a divide-and-conquer algorithm with a time complexity of O(n log n), making it efficient for large datasets."
                          ]
                        },
                        {
                          "topic": "Graph Traversal",
                          "notes": [
                            "Depth-First Search (DFS) employs a stack to explore as far down a branch as possible before backtracking.",
                            "Breadth-First Search (BFS) utilizes a queue for level-order exploration of nodes."
                          ]
                        }
                      ]
                    }
                """

    response = llm.responses.create(
        model="gpt-4o",
        instructions=system_prompt,
        input=f"{notes['class_notes']}"
    )

    result_string = response.output_text
    cleaned = result_string.strip().strip('"').replace("```json", "").replace("```", "").strip()
    print(cleaned)
    data = json.loads(cleaned)
    return jsonify(data=data)


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