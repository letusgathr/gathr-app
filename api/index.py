"""
Vercel Serverless Function entry point for GATHR REST API.
Delegates to GathrRequestHandler in api_server.py.
"""
import os
import sys

# Ensure root directory is on sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from api_server import GathrRequestHandler, init_db

# Initialize database on cold start
try:
    init_db()
except Exception as e:
    print("Database init on cold start note:", e)

# Vercel Python runtime handler
handler = GathrRequestHandler
