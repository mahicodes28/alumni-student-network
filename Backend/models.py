from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
    role = db.Column(db.String(20))  # student / alumni / admin


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    skills = db.Column(db.String(500))
    interests = db.Column(db.String(500))
    career_goal = db.Column(db.String(200))
    company = db.Column(db.String(200))
    experience = db.Column(db.String(200))


class MentorshipRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer)
    alumni_id = db.Column(db.Integer)
    status = db.Column(db.String(50))  # pending/accepted/rejected


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer)
    receiver_id = db.Column(db.Integer)
    message = db.Column(db.String(1000))