from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

notes = [
    {"id": 1, "title": "Note 1", "content": "This is Note 1"},
    {"id": 2, "title": "Note 2", "content": "This is Note 2"},
    {"id": 3, "title": "Note 3", "content": "This is Note 3"}
]
next_id = 4

@app.route("/", methods = ["GET"])
def index():
    return render_template("navigation.html", notes = notes)

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

#def home():
#   return "Test Flask"

if __name__ == "__main__":
    app.run(debug=True)