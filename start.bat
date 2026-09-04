@echo off
echo ===================================================
echo     BreachSense - Dam Break & Flood Dashboard
echo ===================================================
echo.
echo Launching Backend Node.js Express server, Python FastAPI simulation service, and React Vite frontend...
echo.

start "BreachSense Python Simulation Service (Port 8000)" cmd /k "cd simulation && python -m uvicorn main:app --port 8000 --reload"

start "BreachSense Express Backend (Port 5000)" cmd /k "cd backend && npm run dev"

start "BreachSense React Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo Services started!
echo Frontend UI available at: http://localhost:5173
echo Express API available at: http://localhost:5000
echo Python Simulation API at: http://localhost:8000/docs
echo.
pause
