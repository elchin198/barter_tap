#!/usr/bin/env python3
"""
PostgreSQL Database Check Script
This script connects to the PostgreSQL database and returns information about tables and row counts.
"""

import os
import sys
import json
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def check_database():
    """Check PostgreSQL database and return table information."""
    # Get database connection string from environment variables
    database_url = os.environ.get("DATABASE_URL")

    if not database_url:
        return {"error": "DATABASE_URL environment variable not set"}

    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Get list of all tables in the database
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)

        tables = cursor.fetchall()

        result = {
            "database": "PostgreSQL",
            "tables": [],
            "status": "connected"
        }

        # Get row count for each table
        for table in tables:
            table_name = table['table_name']
            cursor.execute(
                sql.SQL("SELECT COUNT(*) as count FROM {}").format(sql.Identifier(table_name))
            )
            count = cursor.fetchone()['count']

            result["tables"].append({
                "name": table_name,
                "rows": count
            })

        cursor.close()
        conn.close()

        return result

    except Exception as e:
        return {
            "error": str(e),
            "status": "error"
        }

if __name__ == "__main__":
    # Check the database and print results
    results = check_database()
    print(json.dumps(results, indent=2))

    # Exit with error code if there was an error
    if results.get("status") == "error":
        sys.exit(1)