"""
GATHR Production Git Stage, Commit & Push Script
Uses Dulwich pure-Python Git engine.
"""
import os
import sys
import dulwich.porcelain

repo_path = os.path.dirname(os.path.abspath(__file__))
repo = dulwich.porcelain.open_repo(repo_path)


files_to_add = [
    'index.html',
    'css/planning.css',
    'css/radar.css',
    'css/components.css',
    'js/planning.js',
    'js/radar.js',
    'js/app.js',
    'js/auth.js',
    'api_server.py',
    'api/index.py',
    'vercel.json',
    'db/database.py',
    'tests/test_api.py',
    'README.md',
    '.env.example',
    '.gitignore',
    'deploy_sync.py'
]

print("1. Staging modified files...")
for f in files_to_add:
    full_path = os.path.join(repo_path, f)
    if os.path.exists(full_path):
        dulwich.porcelain.add(repo, paths=[full_path])
        print(f"   + Added {f}")

print("\n2. Creating clean Git commit...")
commit_msg = (
    "ci(vercel): configure Vercel serverless function entrypoint and edge routing\n\n"
    "- Add api/index.py Vercel serverless function entrypoint\n"
    "- Expose handler = GathrRequestHandler in api_server.py\n"
    "- Update vercel.json rewrites for /api/* and /health to /api/index.py\n"
).encode('utf-8')

try:
    commit_sha = dulwich.porcelain.commit(
        repo,
        message=commit_msg,
        author=b"GATHR Engineering <engineering@letusgather.online>",
        committer=b"GATHR Engineering <engineering@letusgather.online>"
    )
    print(f"   Clean commit created successfully: {commit_sha.decode('utf-8')[:8]}")
except Exception as e:
    print(f"   Commit note: {e}")

print("\n3. Pushing to GitHub (https://github.com/letusgathr/gathr-app.git)...")
token = None
token_file = os.path.join(repo_path, '.git_token')
if os.path.exists(token_file):
    with open(token_file, 'r', encoding='utf-8') as tf:
        token = tf.read().strip()

if not token and len(sys.argv) > 1 and sys.argv[1].strip():
    token = sys.argv[1].strip()
elif not token and 'GITHUB_TOKEN' in os.environ and os.environ['GITHUB_TOKEN'].strip():
    token = os.environ['GITHUB_TOKEN'].strip()
elif not token and 'GH_TOKEN' in os.environ and os.environ['GH_TOKEN'].strip():
    token = os.environ['GH_TOKEN'].strip()

if token:
    remote_url = f"https://{token}@github.com/letusgathr/gathr-app.git"
    try:
        dulwich.porcelain.push(repo, remote_location=remote_url, refspecs=[b"refs/heads/main:refs/heads/main"])
        print("   SUCCESS! Changes successfully pushed to main on https://github.com/letusgathr/gathr-app.git")
    except Exception as e:
        print(f"   Push error: {e}")
else:
    print("   WARNING: No GitHub token found.")
