from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'Some-secret-key'

notes = [
    {"id": 1, "title": "Note 1", "content": "This is Note 1"},
    {"id": 2, "title": "Note 2", "content": "This is Note 2"},
    {"id": 3, "title": "Note 3", "content": "This sourceis Note 3"}
]
next_id = 4

@app.route("/login", methods = ["GET", "POST"])
def login():
    if request.method == 'POST':
        email = request.form['email']
        role = request.form['role']

        session['email'] = email
        session['role'] = role

        return redirect(url_for('main'))
    
    return render_template('login.html')


@app.route("/main", methods = ["GET"])
def main():
    email = session.get('email')
    role = session.get('role')
    if not email or not role:
        return redirect(url_for('login'))
    return render_template("navigation.html", email = email, role = role, notes = notes)



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