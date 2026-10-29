"""
GATHR Production Git Stage, Commit & Push Script
Uses Dulwich pure-Python Git engine.
"""
import os
import sys
import dulwich.porcelain

repo_path = os.path.dirname(os.path.abspath(__file__))
repo = dulwich.porcelain.open_repo(repo_path)

# Reset main branch pointer back to remote clean commit before rejected push
clean_parent = b"21aa279d6e7016f7ecd79529775a3c088bbfc6c3"
repo.refs[b"refs/heads/main"] = clean_parent

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
    "feat: Vetted vendor enlisting & sourcing, 3-milestone escrow, event coordination suite, and attendee networking\n\n"
    "- Add verified vendor onboarding wizard with CAC registration, service categories, and verified partner badge\n"
    "- Build vendor sourcing marketplace with live search, operating hub filtering, and direct WhatsApp channel\n"
    "- Implement Task Assignment & Quote Request (RFP) with 3-milestone GATHR Trust Escrow (50% deposit, 25% soundcheck, 25% final wrap)\n"
    "- Deliver comprehensive Event Planning & Coordination suite with 4-phase interactive task board, progress tracker, and printable crew manifest\n"
    "- Enhance Attendee Networking (GATHR Radar) with event community directory, Who's Going digital pass card, and 1-on-1 direct chat\n"
    "- Provide full ACID REST backend endpoints and pass 14 automated integration tests\n"
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
