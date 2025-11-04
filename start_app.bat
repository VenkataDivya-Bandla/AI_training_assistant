@echo off
echo Starting AI Training Assistant with RAG Quiz Generation...

echo.
echo ========================================
echo Starting Backend RAG API Server...
echo ========================================
start "RAG API Server" cmd /k "cd ai_training_assistant && python rag_api.py"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo Starting Frontend React App...
echo ========================================
start "React Frontend" cmd /k "cd ai_training_assistant && npm start"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo.
echo Backend RAG API: http://localhost:8000
echo Frontend React App: http://localhost:4028
echo.
echo Press any key to exit...
pause > nul
