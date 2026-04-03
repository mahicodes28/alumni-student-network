from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# ================= USER =================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # student / alumni / admin

    # Relationships
    profile = db.relationship("Profile", backref="user", uselist=False)
    posts = db.relationship("Post", backref="user", lazy=True)


# ================= PROFILE =================
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    skills = db.Column(db.String(500))
    interests = db.Column(db.String(500))
    career_goal = db.Column(db.String(200))
    company = db.Column(db.String(200))
    experience = db.Column(db.String(200))


# ================= POSTS =================
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


# ================= MENTORSHIP =================
class MentorshipRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, nullable=False)
    alumni_id = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default="pending")  # pending/accepted/rejected


# ================= CHAT =================
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, nullable=False)
    receiver_id = db.Column(db.Integer, nullable=False)
    message = db.Column(db.String(1000), nullable=False)