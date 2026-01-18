import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    print("Checking active queries and locks...")
    result = conn.execute(text("SELECT pid, state, query, wait_event_type, wait_event FROM pg_stat_activity WHERE state != 'idle';"))
    for row in result:
        print(f"PID: {row.pid}, State: {row.state}, Query: {row.query[:100]}, Wait Event: {row.wait_event_type} / {row.wait_event}")

    print("\nChecking locks...")
    result = conn.execute(text("""
        SELECT
            blocked_locks.pid     AS blocked_pid,
            blocked_activity.query  AS blocked_query,
            blocking_locks.pid     AS blocking_pid,
            blocking_activity.query AS blocking_query
        FROM pg_catalog.pg_locks         blocked_locks
        JOIN pg_catalog.pg_stat_activity blocked_activity  ON blocked_locks.pid = blocked_activity.pid
        JOIN pg_catalog.pg_locks         blocking_locks 
            ON blocking_locks.locktype = blocked_locks.locktype
            AND blocking_locks.DATABASE IS NOT DISTINCT FROM blocked_locks.DATABASE
            AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
            AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
            AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
            AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
            AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
            AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
            AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
            AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
            AND blocking_locks.pid != blocked_locks.pid
        JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_locks.pid = blocking_activity.pid
        WHERE NOT blocked_locks.GRANTED;
    """))
    for row in result:
        print(f"Blocked PID: {row.blocked_pid} is blocked by Blocking PID: {row.blocking_pid}")
        print(f"Blocked Query: {row.blocked_query[:100]}")
        print(f"Blocking Query: {row.blocking_query[:100]}")
