from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# connect database
def get_db():
    conn = sqlite3.connect("database.db")
    return conn

@app.route('/')
def home():
    return "Flask server is running"

# create table (run once)
@app.route('/init')
def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        branch TEXT,
        skills TEXT,
        password TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS alumni (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        company TEXT,
        role TEXT,
        skills TEXT
    )
    ''')

    conn.commit()
    conn.close()

    return "Database initialized"

# register
@app.route('/register', methods=['POST'])
def register():
    data = request.form

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO students (name,email,branch,skills,password) VALUES (?,?,?,?,?)",
                   (data['name'], data['email'], data['branch'], data['skills'], data['password']))

    conn.commit()
    conn.close()

    return "Registration successful"

# login
@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM students WHERE email=? AND password=?", (email, password))
    user = cursor.fetchone()

    conn.close()

    if user:
        return "Login successful"
    else:
        return "Invalid credentials"

# fetch alumni
@app.route('/alumni')
def get_alumni():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM alumni")
    rows = cursor.fetchall()

    conn.close()

    return jsonify(rows)

# run server
if __name__ == '__main__':
    app.run(debug=True)