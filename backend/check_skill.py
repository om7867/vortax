import psycopg2

def check_skill():
    try:
        conn = psycopg2.connect('postgresql://postgres:OMom1122@127.0.0.1:5432/raam')
        cur = conn.cursor()
        cur.execute("SELECT name, domain, category FROM skills_master WHERE id = 'ab38d505-d13f-4916-9231-0274d25ceeba'")
        row = cur.fetchone()
        if row:
            print(f"Name: {row[0]}")
            print(f"Domain: {row[1]} (Type: {type(row[1])})")
            print(f"Category: {row[2]} (Type: {type(row[2])})")
        else:
            print("Skill not found")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_skill()
