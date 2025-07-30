# test_connection.py
import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

try:
    conn = psycopg2.connect(
        host="localhost",
        port="5432", 
        database="jiseti_db",
        user="jiseti_user",
        password="jiseti123"
    )
    print("✅ PostgreSQL connection successful!")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")