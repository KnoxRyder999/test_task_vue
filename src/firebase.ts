import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { config } from './config'

// Initialize Firebase
const app = initializeApp(config.firebase)
export const db = getFirestore(app)
export const functions = getFunctions(app)

// Connect to local Firebase emulator in development
if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001)
  console.log('🔧 Connected to Firebase Functions Emulator')
} 