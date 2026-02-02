@echo off
echo =========================================
echo HRMS Lite - Setup Script
echo =========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.10 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

echo Prerequisites check passed
echo.

REM Setup Backend
echo Setting up Backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo Backend setup complete
echo.

cd ..

REM Setup Frontend
echo Setting up Frontend...
cd frontend

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

echo Installing Node.js dependencies...
call npm install

echo Frontend setup complete
echo.

cd ..

echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo To start the application:
echo.
echo Backend (Terminal 1):
echo   cd backend
echo   venv\Scripts\activate
echo   python main.py
echo.
echo Frontend (Terminal 2):
echo   cd frontend
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo =========================================
pause
