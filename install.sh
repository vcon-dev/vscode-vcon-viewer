#!/bin/bash

# vCon Viewer Extension Installation Script

echo "🚀 Setting up vCon Viewer Extension for VS Code..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Compile the extension
echo "🔨 Compiling the extension..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Failed to compile the extension"
    exit 1
fi

echo "✅ Extension compiled successfully"

echo ""
echo "🎉 vCon Viewer Extension is ready!"
echo ""
echo "To test the extension:"
echo "1. Open this folder in VS Code"
echo "2. Press F5 to launch the extension in debug mode"
echo "3. Open the sample.vcon.json file"
echo "4. Use the command palette (Ctrl+Shift+P) and run 'Open vCon Viewer'"
echo ""
echo "To package the extension for distribution:"
echo "1. Install vsce: npm install -g vsce"
echo "2. Run: vsce package"
echo ""
echo "Happy coding! 🚀"


