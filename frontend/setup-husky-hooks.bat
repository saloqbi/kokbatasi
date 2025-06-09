
@echo off
echo Installing husky and lint-staged...
npm install husky lint-staged --save-dev

echo Running husky install...
npm run prepare

echo Adding pre-commit hook...
npx husky add .husky/pre-commit "npx lint-staged"

echo Setup complete. Husky is now running ESLint fix before each commit.
pause
