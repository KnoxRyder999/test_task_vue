import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { config } from './config'

// Initialize Firebase
const app = initializeApp(config.firebase)
export const db = getFirestore(app)
export const functions = getFunctions(app) 