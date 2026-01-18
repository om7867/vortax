from app.core.database import engine
from sqlalchemy import text

def fix_enums():
    with engine.connect() as conn:
        # PostgreSQL doesn't support IF NOT EXISTS in ALTER TYPE ADD VALUE until 9.6+, 
        # but the best way is to try and catch or check existence.
        
        # We need to commit after each ALTER TYPE if we use raw connection or just use individual calls
        
        # SkillDomain labels are already mostly lowercase, but let's ensure all are there
        new_domains = ['healthcare', 'agriculture', 'urban', 'technology', 'finance', 'education', 'common']
        new_categories = ['technical', 'analytical', 'soft']
        
        # Get existing labels
        existing_domains = [r[0] for r in conn.execute(text("SELECT enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'skilldomain'")).fetchall()]
        existing_categories = [r[0] for r in conn.execute(text("SELECT enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'skillcategory'")).fetchall()]
        
        # Add Domains
        for d in new_domains:
            if d not in existing_domains:
                # ALTER TYPE cannot run inside a transaction block in some PG versions
                # SQLAlchemy usually runs in a transaction. We might need to use execution_options(isolation_level="AUTOCOMMIT")
                print(f"Adding Domain: {d}")
                try:
                    conn.execution_options(isolation_level="AUTOCOMMIT").execute(text(f"ALTER TYPE skilldomain ADD VALUE '{d}'"))
                except Exception as e:
                    print(f"Could not add domain {d}: {e}")

        # Add Categories
        for c in new_categories:
            if c not in existing_categories:
                print(f"Adding Category: {c}")
                try:
                    conn.execution_options(isolation_level="AUTOCOMMIT").execute(text(f"ALTER TYPE skillcategory ADD VALUE '{c}'"))
                except Exception as e:
                    print(f"Could not add category {c}: {e}")

if __name__ == "__main__":
    fix_enums()
