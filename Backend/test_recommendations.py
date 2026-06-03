import unittest
import sys
import os

# Add parent directory to sys.path so we can import from routes
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routes.alumni import clean_text

class TestTFIDFRecommendations(unittest.TestCase):
    def test_clean_text(self):
        text = "Python, ReactJS, Machine Learning! and AI."
        expected = ["python", "reactjs", "machine", "learning", "and", "ai"]
        self.assertEqual(clean_text(text), expected)

    def test_clean_text_empty(self):
        self.assertEqual(clean_text(""), [])
        self.assertEqual(clean_text(None), [])

    def test_similarity_logic(self):
        # We simulate the exact mathematical logic of get_recommendations
        import math
        
        student_profile = {
            "skills": "Python, Machine Learning, Data Science",
            "interests": "AI, research",
            "career_goal": "Become a Data Scientist",
            "domain": "Artificial Intelligence",
            "bio": "Passionate about building ML models."
        }
        
        alumni_list = [
            {
                "name": "Alum A (High Match)",
                "profile": {
                    "skills": "Python, Machine Learning, Deep Learning",
                    "interests": "AI, Neural Networks",
                    "domain": "Artificial Intelligence",
                    "company": "Google",
                    "experience": "5 years",
                    "bio": "Working as an AI researcher building ML systems."
                }
            },
            {
                "name": "Alum B (Medium Match)",
                "profile": {
                    "skills": "Python, Web Development, Flask",
                    "interests": "Web design",
                    "domain": "Software Engineering",
                    "company": "Netflix",
                    "experience": "3 years",
                    "bio": "Web developer with Python experience."
                }
            },
            {
                "name": "Alum C (Low Match)",
                "profile": {
                    "skills": "Java, Spring Boot, MySQL",
                    "interests": "Backend databases",
                    "domain": "Enterprise Java",
                    "company": "Oracle",
                    "experience": "8 years",
                    "bio": "Enterprise software engineer."
                }
            }
        ]

        # Calculate TF-IDF similarities
        s_skills = clean_text(student_profile.get("skills", ""))
        s_interests = clean_text(student_profile.get("interests", ""))
        s_career_goal = clean_text(student_profile.get("career_goal", ""))
        s_domain = clean_text(student_profile.get("domain", ""))
        s_bio = clean_text(student_profile.get("bio", ""))
        
        student_words = s_skills * 3 + s_interests * 2 + s_career_goal * 2 + s_domain * 2 + s_bio
        
        alumni_docs = []
        for a in alumni_list:
            profile = a.get("profile", {})
            a_skills = clean_text(profile.get("skills", ""))
            a_interests = clean_text(profile.get("interests", ""))
            a_domain = clean_text(profile.get("domain", ""))
            a_company = clean_text(profile.get("company", ""))
            a_experience = clean_text(profile.get("experience", ""))
            a_bio = clean_text(profile.get("bio", ""))
            
            alumni_words = a_skills * 3 + a_interests * 2 + a_domain * 2 + a_company * 2 + a_experience + a_bio
            alumni_docs.append((a, alumni_words))
            
        all_docs = [student_words] + [words for _, words in alumni_docs]
        N = len(all_docs)
        
        df = {}
        for doc in all_docs:
            seen = set(doc)
            for w in seen:
                df[w] = df.get(w, 0) + 1
                
        idf = {}
        for w, count in df.items():
            idf[w] = math.log(1 + N / (1 + count))
            
        def get_tfidf_vector(words):
            if not words:
                return {}
            tf = {}
            for w in words:
                tf[w] = tf.get(w, 0) + 1
            
            vector = {}
            for w, count in tf.items():
                vector[w] = (count / len(words)) * idf.get(w, 0)
            return vector
            
        student_vector = get_tfidf_vector(student_words)
        student_mag = math.sqrt(sum(v**2 for v in student_vector.values()))
        
        recommendations = []
        for a, words in alumni_docs:
            profile = a.get("profile", {})
            if not words:
                match_score = 0
            else:
                alumni_vector = get_tfidf_vector(words)
                dot_product = 0.0
                for w in student_vector:
                    if w in alumni_vector:
                        dot_product += student_vector[w] * alumni_vector[w]
                
                alumni_mag = math.sqrt(sum(v**2 for v in alumni_vector.values()))
                if student_mag * alumni_mag == 0:
                    similarity = 0.0
                else:
                    similarity = dot_product / (student_mag * alumni_mag)
                
                match_score = int(round(similarity * 100))
                
            student_domain_val = student_profile.get("domain", "").strip().lower()
            alumni_domain_val = profile.get("domain", "").strip().lower()
            if student_domain_val and alumni_domain_val and student_domain_val == alumni_domain_val:
                match_score = max(match_score, 15)
                
            match_score = min(match_score, 100)
            recommendations.append((a["name"], match_score))
            
        recommendations.sort(key=lambda x: x[1], reverse=True)
        
        # Assertions
        # 1. Alum A should rank first because of high skill overlap and exact domain overlap
        self.assertEqual(recommendations[0][0], "Alum A (High Match)")
        # 2. Alum B should rank second (medium match)
        self.assertEqual(recommendations[1][0], "Alum B (Medium Match)")
        # 3. Alum C should rank third (low match)
        self.assertEqual(recommendations[2][0], "Alum C (Low Match)")
        # 4. Matches should be higher for high overlap
        self.assertTrue(recommendations[0][1] > recommendations[1][1])
        self.assertTrue(recommendations[1][1] > recommendations[2][1])
        
        print("\nTF-IDF Cosine Similarity Test Results:")
        for name, score in recommendations:
            print(f"- {name}: {score}% match")

if __name__ == "__main__":
    unittest.main()
