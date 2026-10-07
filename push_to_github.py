"""
Push GATHR repository to GitHub (https://github.com/letusgathr/gathr-app).
Usage:
    python push_to_github.py <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
Or:
    $env:GITHUB_TOKEN = "your_token_here"
    python push_to_github.py
"""
import sys
import os
import dulwich.porcelain

repo_path = os.path.dirname(os.path.abspath(__file__))

token = None
if len(sys.argv) > 1 and sys.argv[1].strip():
    token = sys.argv[1].strip()
elif 'GITHUB_TOKEN' in os.environ and os.environ['GITHUB_TOKEN'].strip():
    token = os.environ['GITHUB_TOKEN'].strip()
elif 'GH_TOKEN' in os.environ and os.environ['GH_TOKEN'].strip():
    token = os.environ['GH_TOKEN'].strip()

remote_url = "https://github.com/letusgathr/gathr-app.git"

if token:
    target_url = f"https://{token}@github.com/letusgathr/gathr-app.git"
    print(f"Pushing to {remote_url} using provided authentication token...")
    try:
        dulwich.porcelain.push(repo_path, target_url, "refs/heads/main:refs/heads/main")
        print("\n Successfully pushed main branch to https://github.com/letusgathr/gathr-app !")
    except Exception as e:
        print(f"\n Push failed: {e}")
        sys.exit(1)
else:
    print("Authentication Required:")
    print("Please provide your GitHub Personal Access Token (PAT):")
    print("  python push_to_github.py <YOUR_GITHUB_PAT>")
    print("Or set the environment variable:")
    print("  $env:GITHUB_TOKEN='your_token'")
    print("  python push_to_github.py")
