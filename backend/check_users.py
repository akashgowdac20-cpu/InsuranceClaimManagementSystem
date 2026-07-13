import os
import sqlite3

db_path = os.path.abspath("insurance_claim.db")

print("DATABASE PATH:")
print(db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# -----------------------------
# Tables
# -----------------------------
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("\nTABLES:")
print(cursor.fetchall())

# -----------------------------
# Users
# -----------------------------
try:
    cursor.execute("SELECT id, full_name, email, role FROM users")

    print("\nUSERS:")
    rows = cursor.fetchall()

    for row in rows:
        print(row)

    print("\nTotal Users:", len(rows))

except Exception as e:
    print(e)

# -----------------------------
# Claims
# -----------------------------
try:
    cursor.execute("""
        SELECT
            id,
            title,
            description,
            claim_amount,
            status,
            image,
            created_at,
            user_id
        FROM claims
    """)

    print("\nCLAIMS:")
    claims = cursor.fetchall()

    for claim in claims:
        print(claim)

    print("\nTotal Claims:", len(claims))

except Exception as e:
    print(e)

conn.close()