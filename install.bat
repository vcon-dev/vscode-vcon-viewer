@echo off
REM vCon Viewer Extension Installation Script for Windows

echo 🚀 Setting up vCon Viewer Extension for VS Code...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Compile the extension
echo 🔨 Compiling the extension...
npm run compile

if %errorlevel% neq 0 (
    echo ❌ Failed to compile the extension
    pause
    exit /b 1
)

echo ✅ Extension compiled successfully

echo.
echo 🎉 vCon Viewer Extension is ready!
echo.
echo To test the extension:
echo 1. Open this folder in VS Code
echo 2. Press F5 to launch the extension in debug mode
echo 3. Open the sample.vcon.json file
echo 4. Use the command palette (Ctrl+Shift+P) and run 'Open vCon Viewer'
echo.
echo To package the extension for distribution:
echo 1. Install vsce: npm install -g vsce
echo 2. Run: vsce package
echo.
echo Happy coding! 🚀
pause


