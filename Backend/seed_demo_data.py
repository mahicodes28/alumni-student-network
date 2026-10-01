import os
from datetime import datetime
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGO_URL")

if MONGO_URI and MONGO_URI.startswith("mongodb+srv://"):
    client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
else:
    client = MongoClient(MONGO_URI)

db = client["alumni_network"]

users_col = db["users"]
profiles_col = db["profiles"]
career_paths_col = db["career_paths"]
learning_col = db["learning_resources"]
opportunities_col = db["opportunities"]
government_col = db["government_jobs"]

def seed_career_paths():
    career_paths = [
        {
            "id": "data-analyst",
            "title": "Data Analyst",
            "category": "Data & Analytics",
            "description": "Transforms raw data into actionable business insights using statistical tools, SQL, and data visualization.",
            "average_salary": "$75,000 - $110,000",
            "demand": "Very High (22% YoY Growth)",
            "key_skills": ["SQL", "Python", "Power BI", "Tableau", "Statistics", "Excel", "Data Storytelling"],
            "skill_benchmarks": {
                "SQL": 80,
                "Python": 75,
                "Power BI": 75,
                "Statistics": 70,
                "Excel": 85,
                "Data Storytelling": 70
            }
        },
        {
            "id": "data-scientist",
            "title": "Data Scientist",
            "category": "Data & AI",
            "description": "Builds predictive models, machine learning algorithms, and advanced statistical analysis to solve complex problems.",
            "average_salary": "$95,000 - $145,000",
            "demand": "High (35% Growth)",
            "key_skills": ["Python", "Machine Learning", "Statistics", "SQL", "Deep Learning", "Pandas", "Scikit-Learn"],
            "skill_benchmarks": {
                "Python": 90,
                "Machine Learning": 85,
                "Statistics": 85,
                "SQL": 80,
                "Deep Learning": 70,
                "Pandas": 85,
                "Scikit-Learn": 80
            }
        },
        {
            "id": "ml-engineer",
            "title": "Machine Learning Engineer",
            "category": "Data & AI",
            "description": "Designs, builds, and deploys production machine learning models and scalable MLOps pipelines.",
            "average_salary": "$110,000 - $165,000",
            "demand": "Very High",
            "key_skills": ["Python", "Machine Learning", "PyTorch", "TensorFlow", "MLOps", "Docker", "System Design"],
            "skill_benchmarks": {
                "Python": 90,
                "Machine Learning": 85,
                "PyTorch": 80,
                "TensorFlow": 75,
                "MLOps": 75,
                "Docker": 70,
                "System Design": 75
            }
        },
        {
            "id": "full-stack-engineer",
            "title": "Full Stack Engineer",
            "category": "Software Engineering",
            "description": "Develops both frontend user interfaces and backend server architecture for web applications.",
            "average_salary": "$85,000 - $135,000",
            "demand": "Very High",
            "key_skills": ["JavaScript", "React", "Node.js", "Python", "MongoDB", "SQL", "Git", "REST APIs"],
            "skill_benchmarks": {
                "JavaScript": 85,
                "React": 80,
                "Node.js": 75,
                "Python": 70,
                "MongoDB": 75,
                "SQL": 70,
                "REST APIs": 85
            }
        },
        {
            "id": "business-analyst",
            "title": "Business Analyst",
            "category": "Business & Strategy",
            "description": "Bridges the gap between business needs and technical solutions through requirements gathering and process modeling.",
            "average_salary": "$70,000 - $105,000",
            "demand": "High",
            "key_skills": ["Business Analytics", "SQL", "Requirements Gathering", "Excel", "Process Mapping", "Communication"],
            "skill_benchmarks": {
                "Business Analytics": 80,
                "SQL": 70,
                "Requirements Gathering": 85,
                "Excel": 85,
                "Process Mapping": 75,
                "Communication": 90
            }
        },
        {
            "id": "cloud-engineer",
            "title": "Cloud & DevOps Engineer",
            "category": "Infrastructure",
            "description": "Manages cloud infrastructure, CI/CD automation pipelines, Kubernetes clusters, and system reliability.",
            "average_salary": "$100,000 - $150,000",
            "demand": "Very High",
            "key_skills": ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD", "Terraform", "Python"],
            "skill_benchmarks": {
                "AWS": 85,
                "Docker": 80,
                "Kubernetes": 75,
                "Linux": 85,
                "CI/CD": 80,
                "Terraform": 70,
                "Python": 70
            }
        },
        {
            "id": "cybersecurity-analyst",
            "title": "Cybersecurity Analyst",
            "category": "Security",
            "description": "Monitors, detects, and combats security threats, vulnerabilities, and unauthorized access across networks.",
            "average_salary": "$85,000 - $125,000",
            "demand": "High",
            "key_skills": ["Network Security", "Ethical Hacking", "Python", "Linux", "SIEM", "Incident Response"],
            "skill_benchmarks": {
                "Network Security": 85,
                "Ethical Hacking": 75,
                "Python": 70,
                "Linux": 80,
                "SIEM": 75,
                "Incident Response": 80
            }
        },
        {
            "id": "product-manager",
            "title": "Product Manager",
            "category": "Product & Strategy",
            "description": "Leads cross-functional product vision, roadmap execution, user feedback loops, and market launch strategy.",
            "average_salary": "$105,000 - $160,000",
            "demand": "High",
            "key_skills": ["Product Strategy", "User Research", "Agile/Scrum", "Data Analytics", "Wireframing", "Roadmapping"],
            "skill_benchmarks": {
                "Product Strategy": 85,
                "User Research": 80,
                "Agile/Scrum": 85,
                "Data Analytics": 70,
                "Wireframing": 75,
                "Roadmapping": 85
            }
        }
    ]

    career_paths_col.delete_many({})
    career_paths_col.insert_many(career_paths)
    print("[OK] Career paths seeded successfully.")

def seed_learning_resources():
    learning_resources = [
        {
            "id": "lr-sql-1",
            "skill": "SQL",
            "title": "Advanced SQL & Database Design for Analytics",
            "provider": "CareerPath Academy",
            "type": "Course",
            "difficulty": "Intermediate",
            "duration": "12 hours",
            "certification": True,
            "url": "https://coursera.org/learn/advanced-sql-analytics",
            "description": "Master complex JOINs, Window Functions, CTEs, indexing, and query optimization for high-volume data analysis."
        },
        {
            "id": "lr-stats-1",
            "skill": "Statistics",
            "title": "Practical Statistics for Data Science & Analytics",
            "provider": "Khan Academy & edX",
            "type": "Course",
            "difficulty": "Intermediate",
            "duration": "16 hours",
            "certification": True,
            "url": "https://edx.org/learn/statistics-data-science",
            "description": "Core concepts in hypothesis testing, probability distributions, regression models, and confidence intervals."
        },
        {
            "id": "lr-pbi-1",
            "skill": "Power BI",
            "title": "Microsoft Power BI Data Analyst Certification Prep",
            "provider": "Microsoft Learn",
            "type": "Certification",
            "difficulty": "Beginner to Intermediate",
            "duration": "20 hours",
            "certification": True,
            "url": "https://learn.microsoft.com/certifications/power-bi-data-analyst",
            "description": "Learn DAX formulas, interactive dashboard design, data modeling, and automated report distribution."
        },
        {
            "id": "lr-py-1",
            "skill": "Python",
            "title": "Python for Data Analysis & Pandas Mastery",
            "provider": "DataCamp",
            "type": "Course",
            "difficulty": "Beginner",
            "duration": "10 hours",
            "certification": True,
            "url": "https://datacamp.com/courses/python-data-analysis",
            "description": "Data wrangling, cleaning missing values, aggregations, and data visualization with Seaborn and Matplotlib."
        },
        {
            "id": "lr-ml-1",
            "skill": "Machine Learning",
            "title": "Machine Learning Specialization by Andrew Ng",
            "provider": "DeepLearning.AI / Coursera",
            "type": "Course",
            "difficulty": "Intermediate",
            "duration": "40 hours",
            "certification": True,
            "url": "https://coursera.org/specializations/machine-learning-introduction",
            "description": "Supervised learning, unsupervised learning, recommender systems, neural networks, and ML practical tips."
        },
        {
            "id": "lr-react-1",
            "skill": "React",
            "title": "Modern React & State Management Deep Dive",
            "provider": "freeCodeCamp",
            "type": "Course",
            "difficulty": "Intermediate",
            "duration": "15 hours",
            "certification": False,
            "url": "https://freecodecamp.org/learn/front-end-development-libraries",
            "description": "Build high-performance single page applications using React Hooks, Context API, dynamic UI routing, and Tailwind CSS."
        }
    ]

    learning_col.delete_many({})
    learning_col.insert_many(learning_resources)
    print("[OK] Learning resources seeded successfully.")

def seed_opportunities():
    opportunities = [
        {
            "id": "opp-1",
            "title": "Data Analyst Intern",
            "company": "AnalyticsCorp Solutions",
            "location": "Remote / Bengaluru, India",
            "type": "Internship",
            "stipend": "₹25,000 / month",
            "experience": "0 - 1 years",
            "career_target": "Data Analyst",
            "required_skills": ["SQL", "Python", "Power BI", "Excel"],
            "optional_skills": ["Statistics", "Tableau"],
            "description": "Collaborate with senior business analysts to build executive dashboards, run SQL queries on data warehouses, and generate weekly performance metrics.",
            "posted_date": "2 days ago",
            "application_link": "#apply"
        },
        {
            "id": "opp-2",
            "title": "Associate Data Scientist",
            "company": "Cognitive AI Labs",
            "location": "Hybrid / Hyderabad, India",
            "type": "Full-Time",
            "stipend": "₹8.5 - ₹12 LPA",
            "experience": "0 - 2 years",
            "career_target": "Data Scientist",
            "required_skills": ["Python", "Machine Learning", "Statistics", "SQL"],
            "optional_skills": ["Deep Learning", "PyTorch"],
            "description": "Develop automated feature engineering pipelines, train NLP and classification models, and validate predictive model accuracy.",
            "posted_date": "1 day ago",
            "application_link": "#apply"
        },
        {
            "id": "opp-3",
            "title": "Junior Full Stack Developer",
            "company": "TechInnovate Systems",
            "location": "Remote / Pune, India",
            "type": "Full-Time",
            "stipend": "₹6 - ₹9 LPA",
            "experience": "0 - 1 years",
            "career_target": "Full Stack Engineer",
            "required_skills": ["JavaScript", "React", "Node.js", "MongoDB"],
            "optional_skills": ["Python", "REST APIs"],
            "description": "Build modern Web applications using React, Flask/Node, and MongoDB. Responsible for frontend UI widgets and RESTful microservice development.",
            "posted_date": "3 days ago",
            "application_link": "#apply"
        },
        {
            "id": "opp-4",
            "title": "Business Analyst Intern",
            "company": "Global Growth Consulting",
            "location": "Mumbai, India",
            "type": "Internship",
            "stipend": "₹20,000 / month",
            "experience": "Freshers welcome",
            "career_target": "Business Analyst",
            "required_skills": ["Business Analytics", "SQL", "Excel", "Communication"],
            "optional_skills": ["Power BI", "Requirements Gathering"],
            "description": "Assist product managers in client discovery sessions, document functional requirements, and analyze competitive industry benchmarks.",
            "posted_date": "4 days ago",
            "application_link": "#apply"
        }
    ]

    opportunities_col.delete_many({})
    opportunities_col.insert_many(opportunities)
    print("[OK] Opportunities seeded successfully.")

def seed_government_jobs():
    government_jobs = [
        {
            "id": "gov-1",
            "title": "Scientist / Engineer 'SB' (Data Science & IT)",
            "organization": "National Informatics Centre (NIC)",
            "department": "Ministry of Electronics & Information Technology (MeitY)",
            "location": "New Delhi / All India",
            "eligibility": "B.E. / B.Tech / M.Tech in CS / IT / ECE / Data Science with min 65% marks",
            "required_skills": ["Python", "SQL", "Cybersecurity", "Data Analytics"],
            "pay_level": "Level 10 (₹56,100 - ₹1,77,500)",
            "deadline": "2026-11-15",
            "official_url": "https://www.nic.in/recruitments",
            "is_sample_demo": True,
            "demo_label": "Sample / Demo Opportunity",
            "description": "Design secure government data portals, implement cloud analytics, and support digital governance initiatives."
        },
        {
            "id": "gov-2",
            "title": "Technical Assistant (Computer Science / AI)",
            "organization": "Indian Space Research Organisation (ISRO)",
            "department": "Department of Space, Govt. of India",
            "location": "Bengaluru / Sriharikota",
            "eligibility": "First Class Diploma / B.Sc / B.Tech in Computer Science / Information Technology",
            "required_skills": ["Python", "C++", "Linux", "Machine Learning"],
            "pay_level": "Level 7 (₹44,900 - ₹1,42,400)",
            "deadline": "2026-11-30",
            "official_url": "https://www.isro.gov.in/Careers.html",
            "is_sample_demo": True,
            "demo_label": "Sample / Demo Opportunity",
            "description": "Develop telemetry processing scripts, payload data visualization tools, and automated system diagnostic algorithms."
        },
        {
            "id": "gov-3",
            "title": "Trainee Engineer I (Software & Embedded Systems)",
            "organization": "Bharat Electronics Limited (BEL)",
            "department": "Defence PSU, Govt. of India",
            "location": "Bengaluru / Ghaziabad",
            "eligibility": "B.E. / B.Tech (CS / IT / ECE) with 1 year relevant industrial/project experience",
            "required_skills": ["C++", "Python", "Linux", "Network Security"],
            "pay_level": "Consolidated Remuneration ₹30,000 - ₹40,000 / month",
            "deadline": "2026-10-28",
            "official_url": "https://bel-india.in/Careers",
            "is_sample_demo": True,
            "demo_label": "Sample / Demo Opportunity",
            "description": "Work on defence communication software, embedded radar user interfaces, and secure network protocol verification."
        },
        {
            "id": "gov-4",
            "title": "Project Engineer (Cloud Infrastructure & DevOps)",
            "organization": "Centre for Development of Advanced Computing (C-DAC)",
            "department": "Autonomous Scientific Society of MeitY",
            "location": "Pune / Noida",
            "eligibility": "B.E / B.Tech / MCA in CS / IT with minimum 60% aggregate",
            "required_skills": ["Linux", "Docker", "AWS", "Python", "CI/CD"],
            "pay_level": "₹3.6 - ₹5.4 LPA initial CTC",
            "deadline": "2026-12-05",
            "official_url": "https://cdac.in/index.aspx?id=careers",
            "is_sample_demo": True,
            "demo_label": "Sample / Demo Opportunity",
            "description": "Manage high-performance computing clusters, cloud containerization, and automated software deployment workflows."
        }
    ]

    government_col.delete_many({})
    government_col.insert_many(government_jobs)
    print("[OK] Government opportunities seeded successfully.")

def seed_demo_users_and_mentors():
    demo_mentors = [
        {
            "email": "sarah.sharma@industry.org",
            "password": generate_password_hash("Mentor123!"),
            "name": "Sarah Sharma",
            "role": "alumni", # Kept internally as alumni for DB compatibility, displayed as Industry Mentor
            "status": "approved",
            "profile": {
                "skills": "Python, Machine Learning, SQL, Statistics, NLP, MLOps",
                "experience": "5 Years Experience (Senior Data Scientist at Google)",
                "company": "Google",
                "domain": "Data & Artificial Intelligence",
                "career_goal": "Data Scientist",
                "bio": "Senior Data Scientist specializing in NLP, recommendations, and statistical inference. Passionate about guiding students into impactful data careers.",
                "interests": "AI, Mentorship, Career Coaching",
                "education": "M.Tech in Data Science, IIT Delhi",
                "linkedin": "https://linkedin.com/in/sarah-sharma-ds",
                "github": "https://github.com/sarahsharma-ai",
                "availability": "Available for 1-on-1 Mentorship & Mock Interviews"
            }
        },
        {
            "email": "alex.chen@industry.org",
            "password": generate_password_hash("Mentor123!"),
            "name": "Alex Chen",
            "role": "alumni",
            "status": "approved",
            "profile": {
                "skills": "SQL, Power BI, Python, Excel, Business Analytics, Tableau",
                "experience": "6 Years Experience (Lead Analytics Manager at Amazon)",
                "company": "Amazon",
                "domain": "Data & Analytics",
                "career_goal": "Data Analyst",
                "bio": "Analytics professional with deep expertise in SQL, business dashboard design, and executive reporting. Ready to help students bridge academic knowledge with industry expectations.",
                "interests": "Data Storytelling, Dashboard Design, Career Transition",
                "education": "B.Tech Computer Science",
                "linkedin": "https://linkedin.com/in/alexchen-analytics",
                "availability": "Available for Resume Reviews & SQL Practice"
            }
        },
        {
            "email": "rohit.verma@industry.org",
            "password": generate_password_hash("Mentor123!"),
            "name": "Rohit Verma",
            "role": "alumni",
            "status": "approved",
            "profile": {
                "skills": "JavaScript, React, Node.js, Python, MongoDB, Docker, REST APIs",
                "experience": "4 Years Experience (Staff Software Engineer at Microsoft)",
                "company": "Microsoft",
                "domain": "Software Engineering",
                "career_goal": "Full Stack Engineer",
                "bio": "Full-stack cloud developer building scalable SaaS microservices. I enjoy helping students master modern frontend frameworks and backend design patterns.",
                "interests": "Web Architecture, System Design, Hackathons",
                "education": "B.Tech Information Technology",
                "linkedin": "https://linkedin.com/in/rohitverma-dev",
                "github": "https://github.com/rohitverma-code",
                "availability": "Available for Technical Code Reviews"
            }
        }
    ]

    for m in demo_mentors:
        existing = users_col.find_one({"email": m["email"]})
        if not existing:
            user_doc = {
                "name": m["name"],
                "email": m["email"],
                "password": m["password"],
                "role": m["role"],
                "status": m["status"],
                "createdAt": datetime.utcnow()
            }
            res = users_col.insert_one(user_doc)
            prof = m["profile"]
            prof["userId"] = res.inserted_id
            profiles_col.insert_one(prof)
            print(f"[OK] Created demo mentor: {m['name']}")
        else:
            profiles_col.update_one({"userId": existing["_id"]}, {"$set": m["profile"]})

    # Also seed a sample Student profile if not already present
    demo_student_email = "student@demo.com"
    existing_student = users_col.find_one({"email": demo_student_email})
    if not existing_student:
        student_user = {
            "name": "Rohan Patel",
            "email": demo_student_email,
            "password": generate_password_hash("Student123!"),
            "role": "student",
            "status": "approved",
            "createdAt": datetime.utcnow()
        }
        res = users_col.insert_one(student_user)
        student_id = res.inserted_id
        profiles_col.insert_one({
            "userId": student_id,
            "degree": "B.Tech",
            "branch": "Computer Science & Engineering",
            "college": "Institute of Technology",
            "year": "4th Year / 7th Semester",
            "cgpa": "8.4",
            "target_role": "Data Analyst",
            "career_interests": "Data Analytics, Machine Learning, Business Intelligence",
            "skills": "Python, SQL, Power BI, Excel, Pandas, Git",
            "soft_skills": "Problem Solving, Critical Thinking, Communication",
            "tools": "Power BI, VS Code, Jupyter Notebook",
            "programming_languages": "Python, SQL, C++",
            "experience": "Built an E-commerce Sales Analysis Dashboard using Python and Power BI; Completed 2-month summer internship at Local Tech Hub.",
            "projects": "1. Sales Performance Dashboard (Power BI, SQL)\n2. Customer Churn Prediction Model (Python, Scikit-Learn)",
            "certifications": "Google Data Analytics Professional Certificate",
            "achievements": "1st place in University Hackathon 2025",
            "bio": "Aspiring Data Analyst passionate about uncovering actionable business insights from complex datasets.",
            "education": "B.Tech in CS (2022 - 2026)",
            "linkedin": "https://linkedin.com/in/rohan-patel-demo",
            "github": "https://github.com/rohanpatel-demo",
            "portfolio": "https://rohanpatel.dev"
        })
        print("[OK] Created demo student account: student@demo.com / Student123!")

if __name__ == "__main__":
    print("Seeding CareerPath AI Demo Data...")
    seed_career_paths()
    seed_learning_resources()
    seed_opportunities()
    seed_government_jobs()
    seed_demo_users_and_mentors()
    print("[OK] All seeds applied successfully!")
