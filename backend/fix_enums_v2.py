from app.core.database import engine
from sqlalchemy import text

def fix_enums_v2():
    # Use a specialized engine for autocommit operations
    autocommit_engine = engine.execution_options(isolation_level="AUTOCOMMIT")
    
    with autocommit_engine.connect() as conn:
        new_domains = ['healthcare', 'agriculture', 'urban', 'technology', 'finance', 'education', 'common']
        new_categories = ['technical', 'analytical', 'soft']
        
        # Get existing labels
        existing_domains = [r[0] for r in conn.execute(text("SELECT enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'skilldomain'")).fetchall()]
        existing_categories = [r[0] for r in conn.execute(text("SELECT enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'skillcategory'")).fetchall()]
        
        # Add Domains
        for d in new_domains:
            if d not in existing_domains:
                print(f"Adding Domain: {d}")
                try:
                    conn.execute(text(f"ALTER TYPE skilldomain ADD VALUE '{d}'"))
                except Exception as e:
                    print(f"Could not add domain {d}: {e}")

        # Add Categories
        for c in new_categories:
            if c not in existing_categories:
                print(f"Adding Category: {c}")
                try:
                    conn.execute(text(f"ALTER TYPE skillcategory ADD VALUE '{c}'"))
                except Exception as e:
                    print(f"Could not add category {c}: {e}")
        
    print("Enum synchronization complete.")

if __name__ == "__main__":
    fix_enums_v2()
