@echo off
echo Starting development servers...

echo Starting backend...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting frontend...
start cmd /k "cd frontend && npm run dev"

echo Development servers started!
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
pause
