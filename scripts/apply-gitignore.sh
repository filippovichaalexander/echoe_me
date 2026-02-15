#!/bin/bash
# Remove from Git index everything that is now in .gitignore (files stay on disk).
# Run from project root: bash scripts/apply-gitignore.sh

set -e
cd "$(dirname "$0")/.."

echo "Removing all tracked files from index (respecting .gitignore on re-add)..."
git rm -r --cached . 2>/dev/null || true

echo "Re-adding files (ignored paths will stay untracked)..."
git add .

echo "Done. Check: git status"
echo "Then: git commit -m 'Apply .gitignore, stop tracking ignored files' && git push"
