
Write-Host "🔄 Adding all changes..."
git add -A
git add -f .husky/

Write-Host "✍️ Launching Commitizen for commit message..."
npx cz

Write-Host "🚀 Pushing to origin/main..."
git push origin main

Write-Host "✅ All changes committed and pushed successfully!"
