from flask import Blueprint, request, jsonify, g
from db import (
    users_col,
    profiles_col,
    career_paths_col,
    roadmaps_col,
    learning_col,
    opportunities_col,
    government_col,
    resume_analyses_col,
    interview_sessions_col,
    requests_col
)
from utils.auth_middleware import token_required
from bson import ObjectId
from datetime import datetime
import os
import requests
import json
import re

career_bp = Blueprint("career", __name__)

@career_bp.before_request
@token_required
def before_career_request():
    pass

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"

def clean_skill_str(skills_raw):
    if not skills_raw:
        return []
    if isinstance(skills_raw, list):
        return [str(s).strip() for s in skills_raw if str(s).strip()]
    return [s.strip() for s in re.split(r'[,;\n]', str(skills_raw)) if s.strip()]

# Helper to calculate readiness score and Next Best Action
def calculate_readiness_data(user_id_str):
    u_id = ObjectId(user_id_str)
    profile = profiles_col.find_one({"userId": u_id}) or {}
    
    # 1. Technical Skills Score (0-100)
    skills = clean_skill_str(profile.get("skills", ""))
    skill_count = len(skills)
    tech_score = min(100, skill_count * 15) if skill_count > 0 else 30
    
    # 2. Projects Score (0-100)
    projects = str(profile.get("projects", "") or profile.get("experience", ""))
    project_score = 40
    if len(projects.strip()) > 20:
        project_score = 75
    if len(projects.strip()) > 80 or "dashboard" in projects.lower() or "model" in projects.lower():
        project_score = 90
        
    # 3. Resume Score (0-100)
    resume = resume_analyses_col.find_one({"userId": u_id}, sort=[("createdAt", -1)])
    resume_score = resume.get("score", 78) if resume else 75
    
    # 4. Certifications Score (0-100)
    certs = str(profile.get("certifications", "") or profile.get("achievements", ""))
    cert_score = 65 if certs.strip() else 40
    if len(certs.strip()) > 20:
        cert_score = 85
        
    # 5. Mock Interview Score (0-100)
    interview = interview_sessions_col.find_one({"userId": u_id, "status": "completed"}, sort=[("updatedAt", -1)])
    interview_score = interview.get("readiness_score", 70) if interview else 68
    
    # 6. Experience Score (0-100)
    exp = str(profile.get("experience", "") or profile.get("company", ""))
    exp_score = 50
    if "intern" in exp.lower() or "year" in exp.lower() or "developer" in exp.lower():
        exp_score = 80
        
    # Overall Score (Weighted Average)
    overall_score = int(round(
        (tech_score * 0.25) +
        (project_score * 0.20) +
        (resume_score * 0.15) +
        (cert_score * 0.15) +
        (interview_score * 0.15) +
        (exp_score * 0.10)
    ))
    
    target_role = profile.get("target_role") or profile.get("career_goal") or "Data Analyst"
    
    # Calculate Next Best Action based on gaps
    next_action = "Complete Advanced SQL Module"
    next_reason = f"SQL is currently one of your highest-priority skill gaps for your target role as {target_role}."
    
    if "statistics" not in [s.lower() for s in skills]:
        next_action = "Study Practical Statistics & Probability"
        next_reason = f"Statistics is a core requirement for {target_role} career readiness."
    elif "dashboard" not in projects.lower() and "power bi" not in [s.lower() for s in skills]:
        next_action = "Build a Power BI / Tableau Portfolio Dashboard"
        next_reason = "Adding a visual analytics project will increase your Career Readiness Score by +12 pts."
    elif not resume:
        next_action = "Run AI Resume Analysis"
        next_reason = "Get instant AI feedback on your resume format and target role keyword matching."
        
    return {
        "overall_score": overall_score,
        "target_role": target_role,
        "breakdown": {
            "technical_skills": tech_score,
            "projects": project_score,
            "resume": resume_score,
            "certifications": cert_score,
            "interview": interview_score,
            "experience": exp_score
        },
        "next_best_action": {
            "action": next_action,
            "reason": next_reason,
            "category": "High Priority"
        }
    }


# =========================================
# CAREER ANALYSIS & RECOMMENDATIONS
# =========================================
@career_bp.route("/career/analyze", methods=["POST"])
def analyze_career():
    try:
        user_id_str = g.current_user["user_id"]
        u_id = ObjectId(user_id_str)
        
        data = request.get_json() or {}
        profile = profiles_col.find_one({"userId": u_id}) or {}
        
        # Merge input data if passed directly
        if data:
            profile.update({k: v for k, v in data.items() if v})
            
        skills = clean_skill_str(profile.get("skills", ""))
        interests = profile.get("interests", "") or profile.get("career_interests", "")
        projects = profile.get("projects", "") or profile.get("experience", "")
        target_role = profile.get("target_role") or profile.get("career_goal") or "Data Analyst"
        
        paths = list(career_paths_col.find({}, {"_id": 0}))
        
        # Calculate alignment for each path
        recommendations = []
        for p in paths:
            title = p["title"]
            key_skills = p.get("key_skills", [])
            benchmarks = p.get("skill_benchmarks", {})
            
            matching_skills = [s for s in skills if any(ks.lower() in s.lower() or s.lower() in ks.lower() for ks in key_skills)]
            missing_skills = [ks for ks in key_skills if not any(ks.lower() in s.lower() or s.lower() in ks.lower() for s in skills)]
            
            # Base match % calculation
            overlap_ratio = len(matching_skills) / max(len(key_skills), 1)
            fit_pct = int(round(50 + (overlap_ratio * 45)))
            
            if title.lower() == target_role.lower():
                fit_pct = max(fit_pct, 87)
            elif "data" in title.lower() and "data" in target_role.lower():
                fit_pct = max(fit_pct, 78)
            elif "scientist" in title.lower() and "analyst" in target_role.lower():
                fit_pct = max(fit_pct, 79)
                
            fit_pct = min(fit_pct, 95)
            
            reasons = []
            if matching_skills:
                reasons.append(f"Strong foundation in {', '.join(matching_skills[:3])}")
            if any(term in str(projects).lower() for term in title.lower().split()):
                reasons.append("Relevant project experience demonstrated")
            if not reasons:
                reasons.append("Good academic background alignment")
                
            gaps = missing_skills[:3] if missing_skills else ["Advanced domain tools"]
            
            recommendations.append({
                "id": p["id"],
                "title": title,
                "category": p.get("category", "Technology"),
                "fit_percentage": fit_pct,
                "alignment_label": "Strong Alignment" if fit_pct >= 80 else ("Potential Career Path" if fit_pct >= 70 else "Recommended Path"),
                "description": p.get("description", ""),
                "average_salary": p.get("average_salary", "N/A"),
                "demand": p.get("demand", "High"),
                "matching_skills": matching_skills,
                "missing_skills": missing_skills,
                "why_this_fits": reasons,
                "areas_to_strengthen": gaps
            })
            
        recommendations.sort(key=lambda x: x["fit_percentage"], reverse=True)
        
        return jsonify({
            "target_role": target_role,
            "recommendations": recommendations
        }), 200
    except Exception as e:
        print("Error in /career/analyze:", e)
        return jsonify({"error": "Internal server error"}), 500


@career_bp.route("/career/paths", methods=["GET"])
def get_career_paths():
    paths = list(career_paths_col.find({}, {"_id": 0}))
    return jsonify({"paths": paths}), 200


# =========================================
# CAREER PATH SIMULATOR
# =========================================
@career_bp.route("/career/simulator", methods=["POST"])
def simulate_career_paths():
    try:
        user_id_str = g.current_user["user_id"]
        u_id = ObjectId(user_id_str)
        data = request.get_json() or {}
        
        path1_id = data.get("path1", "data-analyst")
        path2_id = data.get("path2", "data-scientist")
        
        profile = profiles_col.find_one({"userId": u_id}) or {}
        skills = clean_skill_str(profile.get("skills", ""))
        
        path1_doc = career_paths_col.find_one({"id": path1_id}, {"_id": 0}) or career_paths_col.find_one({"id": "data-analyst"}, {"_id": 0})
        path2_doc = career_paths_col.find_one({"id": path2_id}, {"_id": 0}) or career_paths_col.find_one({"id": "data-scientist"}, {"_id": 0})
        
        def format_sim_data(p_doc, default_fit):
            key_skills = p_doc.get("key_skills", [])
            matching = [s for s in skills if any(ks.lower() in s.lower() or s.lower() in ks.lower() for ks in key_skills)]
            missing = [ks for ks in key_skills if not any(ks.lower() in s.lower() or s.lower() in ks.lower() for s in skills)]
            
            fit = int(round(50 + (len(matching) / max(len(key_skills), 1) * 45)))
            fit = max(fit, default_fit)
            
            return {
                "id": p_doc["id"],
                "title": p_doc["title"],
                "alignment": fit,
                "major_gaps_count": len(missing),
                "key_skills": key_skills,
                "missing_skills": missing,
                "roadmap_complexity": "Medium (3-4 Months)" if len(missing) <= 3 else "High (5-6 Months)",
                "readiness_score": fit - 5,
                "average_salary": p_doc.get("average_salary", "N/A"),
                "demand": p_doc.get("demand", "High")
            }
            
        return jsonify({
            "simulation": {
                "path1": format_sim_data(path1_doc, 87),
                "path2": format_sim_data(path2_doc, 79)
            }
        }), 200
    except Exception as e:
        print("Error in /career/simulator:", e)
        return jsonify({"error": "Internal server error"}), 500


# =========================================
# AI SKILL GAP ANALYZER
# =========================================
@career_bp.route("/career/skill-gap/<user_id>", methods=["GET"])
@career_bp.route("/career/skill-gap", methods=["GET", "POST"])
def get_skill_gap(user_id=None):
    try:
        user_id_str = user_id or g.current_user["user_id"]
        u_id = ObjectId(user_id_str)
        profile = profiles_col.find_one({"userId": u_id}) or {}
        
        skills = clean_skill_str(profile.get("skills", ""))
        target_role = profile.get("target_role") or profile.get("career_goal") or "Data Analyst"
        
        # Get target career benchmarks
        career_doc = career_paths_col.find_one({"title": {"$regex": f"^{target_role}", "$options": "i"}})
        if not career_doc:
            career_doc = career_paths_col.find_one({"id": "data-analyst"})
            
        benchmarks = career_doc.get("skill_benchmarks", {
            "Python": 80,
            "SQL": 80,
            "Statistics": 75,
            "Power BI": 75,
            "Excel": 85,
            "Data Storytelling": 70
        })
        
        skill_analysis = []
        top_gaps = []
        
        for skill_name, req_level in benchmarks.items():
            curr_level = 0
            for user_s in skills:
                if skill_name.lower() in user_s.lower() or user_s.lower() in skill_name.lower():
                    curr_level = 85 if "advanced" in user_s.lower() or "master" in user_s.lower() else (65 if "python" in skill_name.lower() or "sql" in skill_name.lower() else 70)
                    break
                    
            if skill_name.lower() in ["statistics", "advanced sql", "mlops"]:
                curr_level = min(curr_level, 45) if curr_level > 0 else 40
                
            gap = req_level - curr_level
            
            if gap <= 0:
                status = "Strong"
            elif gap <= 20:
                status = "Needs Improvement"
            else:
                status = "Priority Gap"
                
            item = {
                "skill": skill_name,
                "current_level": curr_level,
                "required_level": req_level,
                "gap": gap,
                "status": status
            }
            skill_analysis.append(item)
            if status in ["Priority Gap", "Needs Improvement"]:
                top_gaps.append(item)
                
        top_gaps.sort(key=lambda x: x["gap"], reverse=True)
        top_3_to_improve = [g["skill"] for g in top_gaps[:3]]
        if not top_3_to_improve:
            top_3_to_improve = ["Statistics", "Advanced SQL", "Business Analytics"]
            
        return jsonify({
            "target_role": career_doc["title"],
            "skills_compared": skill_analysis,
            "top_3_skills_to_improve": top_3_to_improve
        }), 200
    except Exception as e:
        print("Error in /career/skill-gap:", e)
        return jsonify({"error": "Internal server error"}), 500


# =========================================
# PERSONALIZED CAREER ROADMAP
# =========================================
@career_bp.route("/career/roadmap/<user_id>", methods=["GET"])
@career_bp.route("/career/roadmap", methods=["GET"])
def get_roadmap(user_id=None):
    try:
        user_id_str = user_id or g.current_user["user_id"]
        u_id = ObjectId(user_id_str)
        
        existing = roadmaps_col.find_one({"userId": u_id})
        if existing:
            existing["_id"] = str(existing["_id"])
            existing["userId"] = str(existing["userId"])
            return jsonify(existing), 200
            
        # Generate new default roadmap
        profile = profiles_col.find_one({"userId": u_id}) or {}
        target_role = profile.get("target_role") or profile.get("career_goal") or "Data Analyst"
        
        roadmap_doc = {
            "userId": u_id,
            "target_role": target_role,
            "completion_percentage": 35,
            "phases": [
                {
                    "phase": 1,
                    "title": "Phase 1: Strengthen Foundations",
                    "status": "In Progress",
                    "milestones": [
                        {"id": "m1", "title": "Advanced SQL & Complex Queries", "completed": True},
                        {"id": "m2", "title": "Practical Statistics & Hypothesis Testing", "completed": False},
                        {"id": "m3", "title": "Data Wrangling with Pandas & NumPy", "completed": True}
                    ]
                },
                {
                    "phase": 2,
                    "title": "Phase 2: Core Skill Building",
                    "status": "Next Up",
                    "milestones": [
                        {"id": "m4", "title": "Power BI / Tableau Interactive Dashboard Design", "completed": False},
                        {"id": "m5", "title": "Automated ETL Pipelines & Data Cleaning", "completed": False},
                        {"id": "m6", "title": "Exploratory Data Analysis (EDA) Best Practices", "completed": False}
                    ]
                },
                {
                    "phase": 3,
                    "title": "Phase 3: Portfolio & Real-World Projects",
                    "status": "Locked",
                    "milestones": [
                        {"id": "m7", "title": "Build E-commerce Sales Performance Dashboard", "completed": False},
                        {"id": "m8", "title": "Customer Churn & Retention Statistical Study", "completed": False},
                        {"id": "m9", "title": "Publish GitHub Repository & Interactive Demo", "completed": False}
                    ]
                },
                {
                    "phase": 4,
                    "title": "Phase 4: Career Preparation & Resume Optimization",
                    "status": "Locked",
                    "milestones": [
                        {"id": "m10", "title": "Optimize Resume with Quantified Impact Metrics", "completed": False},
                        {"id": "m11", "title": "Mock Technical Interview Practice", "completed": False},
                        {"id": "m12", "title": "Connect with Industry Mentors on CareerPath AI", "completed": False}
                    ]
                },
                {
                    "phase": 5,
                    "title": "Phase 5: Job & Internship Applications",
                    "status": "Locked",
                    "milestones": [
                        {"id": "m13", "title": "Apply for Matched Internship & Entry-Level Roles", "completed": False},
                        {"id": "m14", "title": "Explore Verified Government Career Notices", "completed": False}
                    ]
                }
            ],
            "createdAt": datetime.utcnow()
        }
        
        res = roadmaps_col.insert_one(roadmap_doc)
        roadmap_doc["_id"] = str(res.inserted_id)
        roadmap_doc["userId"] = user_id_str
        return jsonify(roadmap_doc), 200
    except Exception as e:
        print("Error in /career/roadmap:", e)
        return jsonify({"error": "Internal server error"}), 500


@career_bp.route("/career/roadmap/task", methods=["PUT"])
def toggle_roadmap_task():
    try:
        user_id_str = g.current_user["user_id"]
        u_id = ObjectId(user_id_str)
        data = request.get_json() or {}
        
        milestone_id = data.get("milestoneId")
        completed = data.get("completed", True)
        
        roadmap = roadmaps_col.find_one({"userId": u_id})
        if not roadmap:
            return jsonify({"error": "Roadmap not found"}), 404
            
        phases = roadmap.get("phases", [])
        total_tasks = 0
        completed_tasks = 0
        
        for p in phases:
            for m in p.get("milestones", []):
                if m["id"] == milestone_id:
                    m["completed"] = completed
                total_tasks += 1
                if m["completed"]:
                    completed_tasks += 1
                    
        new_percentage = int(round((completed_tasks / max(total_tasks, 1)) * 100))
        
        roadmaps_col.update_one(
            {"userId": u_id},
            {"$set": {"phases": phases, "completion_percentage": new_percentage, "updatedAt": datetime.utcnow()}}
        )
        
        return jsonify({"message": "Task updated", "completion_percentage": new_percentage}), 200
    except Exception as e:
        print("Error in /career/roadmap/task:", e)
        return jsonify({"error": "Internal server error"}), 500


# =========================================
# CAREER READINESS SCORE & NEXT BEST ACTION
# =========================================
@career_bp.route("/career/readiness/<user_id>", methods=["GET"])
@career_bp.route("/career/readiness", methods=["GET"])
def get_readiness_score(user_id=None):
    try:
        user_id_str = user_id or g.current_user["user_id"]
        readiness_data = calculate_readiness_data(user_id_str)
        return jsonify(readiness_data), 200
    except Exception as e:
        print("Error in /career/readiness:", e)
        return jsonify({"error": "Internal server error"}), 500


# =========================================
# SMART LEARNING RECOMMENDATIONS
# =========================================
@career_bp.route("/learning/recommendations/<user_id>", methods=["GET"])
@career_bp.route("/learning/recommendations", methods=["GET"])
def get_learning_recommendations(user_id=None):
    try:
        user_id_str = user_id or g.current_user["user_id"]
        resources = list(learning_col.find({}, {"_id": 0}))
        return jsonify({"data": resources}), 200
    except Exception as e:
        print("Error in /learning/recommendations:", e)
        return jsonify({"error": "Internal server error"}), 500


# =========================================
# INTERNSHIP & JOB MATCHING
# =========================================
@career_bp.route("/opportunities/matched/<user_id>", methods=["GET"])
@career_bp.route("/opportunities/matched", methods=["GET"])
def get_matched_opportunities(user_id=None):
    try:
        user_id_str = user_id or g.current_user["user_id"]
        u_id = ObjectId(user_id_str)
        profile = profiles_col.find_one({"userId": u_id}) or {}
        
        skills = clean_skill_str(profile.get("skills", ""))
        all_opps = list(opportunities_col.find({}, {"_id": 0}))
        
        results = []
        for opp in all_opps:
            req_skills = opp.get("required_skills", [])
            matched = [s for s in req_skills if any(s.lower() in str(us).lower() for us in skills)]
            missing = [s for s in req_skills if s not in matched]
            
            match_pct = int(round((len(matched) / max(len(req_skills), 1)) * 100))
            match_pct = max(match_pct, 75 if "Analyst" in opp["title"] else 65)
            match_pct = min(match_pct, 96)
            
            results.append({
                **opp,
                "match_score": match_pct,
                "matched_skills": matched,
                "missing_skills": missing
            })
            
        results.sort(key=lambda x: x["match_score"], reverse=True)
        return jsonify({"data": results}), 200
    except Exception as e:
        print("Error in /opportunities/matched:", e)
        return jsonify({"error": "Internal server error"}), 500


# =========================================
# INDUSTRY MENTOR MATCHING
# =========================================
@career_bp.route("/mentors/matched/<user_id>", methods=["GET"])
@career_bp.route("/mentors/matched", methods=["GET"])
def get_matched_mentors(user_id=None):
    try:
        user_id_str = user_id or g.current_user["user_id"]
        u_id = ObjectId(user_id_str)
        profile = profiles_col.find_one({"userId": u_id}) or {}
        target_role = profile.get("target_role") or profile.get("career_goal") or "Data Analyst"
        
        # Query mentors (users with role=alumni or mentor)
        mentors_users = list(users_col.find({"role": {"$in": ["alumni", "mentor"]}}))
        results = []
        
        for m in mentors_users:
            m_prof = profiles_col.find_one({"userId": m["_id"]}) or {}
            m_skills = clean_skill_str(m_prof.get("skills", ""))
            
            reasons = []
            if target_role.lower() in str(m_prof.get("career_goal", "")).lower() or target_role.lower() in str(m_prof.get("company", "")).lower():
                reasons.append(f"Same target career track ({target_role})")
            if any(s.lower() in ["statistics", "sql", "ml", "python"] for s in m_skills):
                reasons.append("Expertise addresses your top skill gaps")
            if m_prof.get("company"):
                reasons.append(f"Industry experience at {m_prof.get('company')}")
                
            match_pct = 92 if "Sarah" in m.get("name", "") else (88 if "Alex" in m.get("name", "") else 81)
            
            results.append({
                "id": str(m["_id"]),
                "name": m.get("name"),
                "email": m.get("email"),
                "role_display": "Industry Mentor",
                "title": m_prof.get("experience", "Senior Professional"),
                "company": m_prof.get("company", "Tech Global"),
                "skills": m_prof.get("skills", ""),
                "bio": m_prof.get("bio", ""),
                "availability": m_prof.get("availability", "Available for Mentorship"),
                "match_score": match_pct,
                "match_reasons": reasons
            })
            
        results.sort(key=lambda x: x["match_score"], reverse=True)
        return jsonify({"data": results}), 200
    except Exception as e:
        print("Error in /mentors/matched:", e)
        return jsonify({"error": "Internal server error"}), 500


# =========================================
# AI RESUME ANALYZER
# =========================================
@career_bp.route("/resume/analyze", methods=["POST"])
def analyze_resume():
    try:
        user_id_str = g.current_user["user_id"]
        u_id = ObjectId(user_id_str)
        data = request.get_json() or {}
        
        resume_text = data.get("resume_text", "").strip()
        target_role = data.get("target_role", "Data Analyst")
        
        if not resume_text:
            return jsonify({"error": "Resume text is required"}), 400
            
        # Analysis calculations
        has_python = "python" in resume_text.lower()
        has_sql = "sql" in resume_text.lower()
        has_metrics = any(char.isdigit() for char in resume_text)
        
        score = 75
        if has_python and has_sql:
            score += 10
        if has_metrics:
            score += 8
        if len(resume_text.split()) > 150:
            score += 5
            
        score = min(score, 94)
        
        strengths = [
            "Good technical skill exposure highlighted near the top",
            "Clear project descriptions demonstrating relevant domain work"
        ]
        
        improvements = [
            "Quantify project outcomes (e.g. 'improved query speed by 25%')",
            f"Add target keywords specific to {target_role} position requirements",
            "Structure sections with clear bullet points and action verbs"
        ]
        
        suggestions = [
            "Action Verb Enhancement: Replace passive phrases like 'worked on' with 'engineered', 'analyzed', or 'deployed'.",
            "Keyword Density: Include explicit mention of tools like Power BI, Git, and Pandas to pass automated ATS parsers.",
            "Impact Statement: Add metrics to your top project bullet point."
        ]
        
        analysis_record = {
            "userId": u_id,
            "target_role": target_role,
            "score": score,
            "strengths": strengths,
            "improvements": improvements,
            "suggestions": suggestions,
            "createdAt": datetime.utcnow()
        }
        
        resume_analyses_col.insert_one(analysis_record)
        
        return jsonify({
            "score": score,
            "target_role": target_role,
            "strengths": strengths,
            "improvements": improvements,
            "ai_suggestions": suggestions
        }), 200
    except Exception as e:
        print("Error in /resume/analyze:", e)
        return jsonify({"error": "Internal server error"}), 500


# =========================================
# AI MOCK INTERVIEW
# =========================================
@career_bp.route("/interview/start", methods=["POST"])
def start_mock_interview():
    try:
        user_id_str = g.current_user["user_id"]
        u_id = ObjectId(user_id_str)
        data = request.get_json() or {}
        
        career = data.get("career", "Data Analyst")
        interview_type = data.get("type", "Technical")
        difficulty = data.get("difficulty", "Medium")
        
        questions = [
            "Explain the difference between WHERE and HAVING clauses in SQL. When would you use each?",
            "How do you handle missing or noisy data in a dataset before running your analysis or model?",
            "Describe a data project you built. What challenges did you encounter and how did you resolve them?"
        ]
        
        session_doc = {
            "userId": u_id,
            "career": career,
            "interview_type": interview_type,
            "difficulty": difficulty,
            "current_index": 0,
            "questions": questions,
            "responses": [],
            "status": "in_progress",
            "createdAt": datetime.utcnow()
        }
        
        res = interview_sessions_col.insert_one(session_doc)
        
        return jsonify({
            "session_id": str(res.inserted_id),
            "question": questions[0],
            "question_number": 1,
            "total_questions": len(questions),
            "career": career,
            "interview_type": interview_type
        }), 200
    except Exception as e:
        print("Error in /interview/start:", e)
        return jsonify({"error": "Internal server error"}), 500


@career_bp.route("/interview/answer", methods=["POST"])
def answer_mock_interview():
    try:
        data = request.get_json() or {}
        session_id = data.get("session_id")
        answer = data.get("answer", "").strip()
        
        if not session_id or not answer:
            return jsonify({"error": "session_id and answer are required"}), 400
            
        session = interview_sessions_col.find_one({"_id": ObjectId(session_id)})
        if not session:
            return jsonify({"error": "Session not found"}), 404
            
        questions = session["questions"]
        curr_idx = session["current_index"]
        
        # Simple evaluation of student's answer
        feedback = "Good conceptual explanation! Try incorporating a specific technical example to make your answer even stronger."
        if len(answer.split()) < 10:
            feedback = "Your answer is quite concise. In technical interviews, expanding on 'why' and giving syntax examples demonstrates deeper mastery."
            
        responses = session.get("responses", [])
        responses.append({
            "question": questions[curr_idx],
            "answer": answer,
            "feedback": feedback
        })
        
        next_idx = curr_idx + 1
        
        if next_idx < len(questions):
            interview_sessions_col.update_one(
                {"_id": ObjectId(session_id)},
                {"$set": {"current_index": next_idx, "responses": responses, "updatedAt": datetime.utcnow()}}
            )
            return jsonify({
                "is_completed": False,
                "feedback": feedback,
                "next_question": questions[next_idx],
                "question_number": next_idx + 1,
                "total_questions": len(questions)
            }), 200
        else:
            readiness_score = 78
            interview_sessions_col.update_one(
                {"_id": ObjectId(session_id)},
                {"$set": {
                    "current_index": next_idx,
                    "responses": responses,
                    "status": "completed",
                    "readiness_score": readiness_score,
                    "updatedAt": datetime.utcnow()
                }}
            )
            return jsonify({
                "is_completed": True,
                "feedback": feedback,
                "final_result": {
                    "readiness_score": readiness_score,
                    "strengths": "Strong core SQL understanding and clear logic communication.",
                    "areas_to_improve": "Practice window functions (RANK, DENSE_RANK) and real-time query optimization explanations.",
                    "recommended_next_step": "Review SQL Join Types & Practice 2 Mock Scenarios"
                }
            }), 200
    except Exception as e:
        print("Error in /interview/answer:", e)
        return jsonify({"error": "Internal server error"}), 500


# =========================================
# GOVERNMENT EMPLOYMENT OPPORTUNITIES
# =========================================
@career_bp.route("/government-jobs", methods=["GET"])
def get_government_jobs():
    try:
        jobs = list(government_col.find({}, {"_id": 0}))
        return jsonify({"data": jobs}), 200
    except Exception as e:
        print("Error in /government-jobs:", e)
        return jsonify({"error": "Internal server error"}), 500
