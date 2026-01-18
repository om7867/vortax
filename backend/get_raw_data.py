
import os
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("DATABASE_URL")
if not url:
    print("DATABASE_URL not found")
    exit(1)

# Fix for postgres scheme
if url.startswith("postgresql+psycopg2"):
    url = url.replace("postgresql+psycopg2", "postgresql")

try:
    conn = psycopg2.connect(url)
    cur = conn.cursor()
    
    # 1. Get admin user ID
    cur.execute("SELECT id FROM users WHERE username = 'admin'")
    user_id = cur.fetchone()[0]
    print(f"Admin User ID: {user_id}")
    
    # 2. Check SkillGapResults
    cur.execute("SELECT skill_id, gap_percentage, gap_status, evaluated_at FROM skill_gap_results WHERE user_id = %s", (user_id,))
    gaps = cur.fetchall()
    print(f"\nFound {len(gaps)} SkillGapResults for admin:")
    for g in gaps:
        print(f"  Skill: {g[0]}, Gap: {g[1]}, Status: {g[2]}, At: {g[3]}")
        
    # 3. Check TrendingSkills
    cur.execute("SELECT skill_name, demand_score FROM trending_skills")
    trending = cur.fetchall()
    print(f"\nFound {len(trending)} TrendingSkills")
    for t in trending:
        print(f"  {t[0]}: {t[1]}")
        
    # 4. Check LearningResources
    cur.execute("SELECT count(*) FROM learning_resources")
    res_count = cur.fetchone()[0]
    print(f"\nTotal LearningResources: {res_count}")
    
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
