import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'
import type { FirebaseResponse } from './types'

// Collection name: "ramen_preferences" - because ramen is my favorite dish and this collection stores user preferences like emails
const saveEmailFunction = httpsCallable(functions, 'saveRamenPreference')
const loadEmailFunction = httpsCallable(functions, 'loadRamenPreference')

export const saveEmailToFirestore = (email: string): Promise<FirebaseResponse> => {
  return saveEmailFunction({ email })
    .then((result: any) => {
      return result.data as FirebaseResponse
    })
    .catch((error: any) => {
      console.error('Error saving email:', error)
      return {
        success: false,
        message: 'Failed to save email'
      }
    })
}

export const loadEmailFromFirestore = (): Promise<FirebaseResponse> => {
  return loadEmailFunction({})
    .then((result: any) => {
      return result.data as FirebaseResponse
    })
    .catch((error: any) => {
      console.error('Error loading email:', error)
      return {
        success: false,
        message: 'Failed to load email'
      }
    })
} 