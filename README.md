# Vue 3 + TypeScript + Firebase Functions Mini-SPA

A single-page application that allows users to save and remember their email address using Firebase Firestore and Cloud Functions.

## Collection Name Explanation

The Firestore collection is named **"ramen_preferences"** because ramen is my favorite dish. This collection stores user preferences (in this case, email addresses) in a way that's organized around personal taste and choice, just like how ramen preferences vary from person to person.

## Features

- ✅ Email input field with validation
- ✅ "Remember my email" button functionality
- ✅ Email saved to Firestore via Cloud Function
- ✅ Email displayed on the page after saving
- ✅ Email loaded from Firestore on page reload
- ✅ Promise-based implementation (no async/await)
- ✅ All interface texts in separate messages file
- ✅ Beautiful, responsive UI

## Project Structure

```
├── src/
│   ├── App.vue              # Main Vue component
│   ├── main.ts              # Vue app entry point
│   ├── messages.ts          # Interface texts
│   ├── emailService.ts      # Firebase Functions service
│   ├── firebase.ts          # Firebase configuration
│   └── types.ts             # TypeScript interfaces
├── functions/
│   ├── src/
│   │   └── index.ts         # Firebase Cloud Functions
│   ├── package.json         # Functions dependencies
│   └── tsconfig.json        # Functions TypeScript config
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
├── package.json             # Main project dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── index.html               # Main HTML file
```

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created

## Setup Instructions

### 1. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Configuration

1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase project:
   ```bash
   firebase use --add
   ```

3. Update `src/firebase.ts` with your Firebase project configuration:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-actual-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   }
   ```

### 3. Launch Instructions

#### Option A: Development Mode (Recommended for testing)

1. Start the Firebase emulator:
   ```bash
   npm run serve
   ```

2. In a new terminal, start the Vue development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

#### Option B: Production Mode

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy Firebase Functions:
   ```bash
   npm run deploy
   ```

3. Serve the built files:
   ```bash
   npm run preview
   ```

## Firebase Functions

The application uses two Cloud Functions:

- **`saveRamenPreference`**: Saves the user's email to Firestore
- **`loadRamenPreference`**: Loads the user's saved email from Firestore

Both functions use Promise-based implementation with `.then()` and `.catch()` as required.

## Technical Details

- **Frontend**: Vue 3 with Composition API and TypeScript
- **Build Tool**: Vite for fast development and building
- **Backend**: Firebase Cloud Functions with Node.js 18
- **Database**: Firestore (NoSQL)
- **Authentication**: None (public access for demo purposes)
- **Styling**: CSS with modern design principles

## Notes

- The application stores only one email per user (using a fixed document ID)
- All interface texts are centralized in `src/messages.ts` for easy localization
- The code includes a personal comment about exploring hidden cafes in Tokyo
- Firestore rules are set to allow public read/write access for demonstration

## Troubleshooting

- If you see TypeScript errors, make sure all dependencies are installed
- For Firebase Functions errors, check that the emulator is running
- Ensure your Firebase project has Firestore enabled
- Verify that your Firebase configuration in `src/firebase.ts` is correct

## Part 2: AI Integration Feature

### Smart Email Validation with AI

I've designed an AI-powered email validation feature that goes beyond basic format checking to provide intelligent suggestions and detect potential issues.

#### AI Feature Description

**Smart Email Validation & Suggestions** - This feature uses AI to:
- Analyze email patterns and suggest corrections
- Detect common typos in email domains (e.g., "gmial.com" → "gmail.com")
- Provide intelligent suggestions for professional email formats
- Identify potentially disposable or suspicious email domains
- Offer contextual hints based on the user's input

#### AI Tool Used: ChatGPT

I used ChatGPT to generate the smart validation logic and suggestions. Here's the generated code and dialogue:

**ChatGPT Prompt:**
```
I need to create a smart email validation function that can:
1. Detect common email typos and suggest corrections
2. Provide intelligent suggestions for professional email formats
3. Identify potentially disposable email domains
4. Give contextual hints

Please provide TypeScript code for this feature.
```

**ChatGPT Response:**
```typescript
interface EmailValidationResult {
  isValid: boolean;
  suggestions: string[];
  warnings: string[];
  confidence: number;
}

const commonEmailTypos: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com'
};

const disposableDomains = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'throwawaymail.com', 'temp-mail.org'
];

export function smartEmailValidation(email: string): EmailValidationResult {
  const result: EmailValidationResult = {
    isValid: false,
    suggestions: [],
    warnings: [],
    confidence: 0
  };

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    result.suggestions.push('Please enter a valid email address format (user@domain.com)');
    return result;
  }

  const [localPart, domain] = email.split('@');
  
  // Check for common typos
  if (commonEmailTypos[domain]) {
    result.suggestions.push(`Did you mean ${localPart}@${commonEmailTypos[domain]}?`);
    result.warnings.push('Possible typo detected in domain name');
  }

  // Check for disposable domains
  if (disposableDomains.includes(domain)) {
    result.warnings.push('This appears to be a temporary email address. Consider using a permanent email for important communications.');
  }

  // Professional email suggestions
  if (localPart.includes('123') || localPart.includes('test') || localPart.length < 3) {
    result.suggestions.push('Consider using a more professional email address for business communications');
  }

  // Domain-specific suggestions
  if (domain === 'gmail.com' && localPart.length > 20) {
    result.suggestions.push('Gmail addresses work best when they are concise and memorable');
  }

  result.isValid = true;
  result.confidence = 0.9;
  
  if (result.suggestions.length === 0 && result.warnings.length === 0) {
    result.suggestions.push('Email looks good!');
  }

  return result;
}
```

#### Integration Approach

To integrate this AI-powered validation:

1. **Create a new service file** `src/aiValidationService.ts` with the generated code
2. **Update the App.vue component** to use smart validation on email input
3. **Add real-time validation feedback** with suggestions and warnings
4. **Integrate with existing Firebase Functions** to store validation results
5. **Add UI components** to display AI suggestions and warnings

#### Benefits of AI Integration

- **User Experience**: Provides helpful suggestions instead of just error messages
- **Error Prevention**: Catches common typos before they cause issues
- **Professional Guidance**: Helps users create better email addresses
- **Intelligent Feedback**: Context-aware suggestions based on input patterns

#### Future AI Enhancements

- **Machine Learning**: Train on user behavior to improve suggestions
- **Natural Language Processing**: Generate more conversational validation messages
- **Predictive Analysis**: Suggest email formats based on user's industry or role
- **Multi-language Support**: AI-generated translations for validation messages 