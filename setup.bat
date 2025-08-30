@echo off
echo Setting up Vue 3 + Firebase Mini-SPA...

REM Install main project dependencies
echo Installing main project dependencies...
npm install

REM Install Firebase Functions dependencies
echo Installing Firebase Functions dependencies...
cd functions
npm install
cd ..

echo.
echo Setup complete! Next steps:
echo 1. Update src/config.ts with your Firebase project configuration
echo 2. Run 'npm run serve' to start Firebase emulator
echo 3. Run 'npm run dev' in another terminal to start Vue dev server
echo 4. Open http://localhost:3000 in your browser
echo.
echo For production deployment:
echo 1. Run 'npm run build'
echo 2. Run 'npm run deploy' to deploy Firebase Functions
echo 3. Run 'npm run preview' to preview the built app
pause 