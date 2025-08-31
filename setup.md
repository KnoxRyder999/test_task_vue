# Project Setup Guide

## Quick Start (Windows)

### 1. Prerequisites
- Node.js 18+ installed
- Git installed
- Firebase CLI installed globally: `npm install -g firebase-tools`

### 2. Project Setup
```bash
# Clone or download the project
cd test

# Install main project dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 3. Firebase Configuration
```bash
# Login to Firebase
firebase login

# Initialize Firebase project (if not already done)
firebase init functions
# Choose "Use an existing project" or create a new one
# Select TypeScript
# Use ESLint: No
# Install dependencies: Yes

# Set your project as active
firebase use your-project-id
```

### 4. Update Configuration Files
1. **Update `src/config.ts`** with your Firebase project details:
   ```typescript
   export const config = {
     firebase: {
       apiKey: "your-actual-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id"
     }
   };
   ```

2. **Update `src/emailService.ts`** with your project ID:
   ```typescript
   const baseUrl = import.meta.env.DEV 
     ? 'http://localhost:5001/your-project-id/us-central1'
     : 'https://us-central1/your-project-id.cloudfunctions.net'
   ```

### 5. Launch the Application

#### Development Mode
```bash
# Terminal 1: Start Firebase emulator
npm run serve

# Terminal 2: Start Vue development server
npm run dev
```

Open browser to: `http://localhost:5173`

#### Production Mode
```bash
# Build the project
npm run build

# Deploy Firebase Functions
npm run deploy

# Preview the built app
npm run preview
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: If port 5001 is busy, update `firebase.json` emulator port
2. **CORS errors**: Ensure Firebase emulator is running before starting Vue app
3. **TypeScript errors**: Run `npm install` in both root and functions directories
4. **Firebase connection**: Check that your project ID matches in all config files

### Firebase Emulator Issues
```bash
# Clear emulator data
firebase emulators:start --only functions --import=./emulator-data --export-on-exit=./emulator-data

# Check emulator status
firebase emulators:start --only functions --ui
```

## Project Structure
```
test/
├── src/                    # Vue frontend source
│   ├── App.vue           # Main component
│   ├── messages.ts       # Interface texts
│   ├── emailService.ts   # Firebase Functions service
│   ├── aiValidationService.ts # AI validation logic
│   └── types.ts          # TypeScript interfaces
├── functions/             # Firebase Cloud Functions
│   ├── src/index.ts      # Functions implementation
│   └── package.json      # Functions dependencies
├── firebase.json          # Firebase configuration
├── package.json           # Main project dependencies
└── README.md              # Project documentation
```

## Collection Name: "ramen_preferences"
The Firestore collection is named after my favorite dish (ramen) because this collection stores user preferences and choices, just like how ramen preferences vary from person to person. It's a fun way to organize user data around personal taste and choice. 