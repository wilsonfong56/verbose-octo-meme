from test_mainpage import db

class User(db.Model):
    name = db.Column(db.String(50), nullable=False, primary_key=True)
    role = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f'Name: {self.name}\nRole: {self.role}'