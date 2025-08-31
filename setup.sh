#!/bin/bash

echo "========================================"
echo "Vue 3 + Firebase Mini-SPA Setup"
echo "========================================"
echo

echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js and npm are installed"
echo

echo "Installing main project dependencies..."
if ! npm install; then
    echo "ERROR: Failed to install main dependencies"
    exit 1
fi
echo "✓ Main dependencies installed"
echo

echo "Installing Firebase Functions dependencies..."
cd functions
if ! npm install; then
    echo "ERROR: Failed to install Firebase Functions dependencies"
    exit 1
fi
cd ..
echo "✓ Firebase Functions dependencies installed"
echo

echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo
echo "Next steps:"
echo "1. Update src/config.ts with your Firebase project details"
echo "2. Update src/emailService.ts with your project ID"
echo "3. Run 'firebase login' to authenticate"
echo "4. Run 'firebase use your-project-id' to set your project"
echo "5. Start development: 'npm run serve' (Terminal 1) and 'npm run dev' (Terminal 2)"
echo
echo "See setup.md for detailed instructions."
echo 