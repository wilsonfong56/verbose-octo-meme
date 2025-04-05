from test_mainpage import db

class Comment(db.Model):
    commentId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    poster = db.Column(db.String(50), nullable=False)
    comment = db.Column(db.String(100), nullable=False)
