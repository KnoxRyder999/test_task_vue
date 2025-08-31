import type { FirebaseResponse } from './types'

// Collection name: "ramen_preferences" - because ramen is my favorite dish and this collection stores user preferences like emails

// Base URL for Firebase Functions (local emulator in development)
const baseUrl = import.meta.env.DEV 
  ? 'http://localhost:5001/your-project-id/us-central1'
  : 'https://us-central1/your-project-id.cloudfunctions.net'

export const saveEmailToFirestore = (email: string): Promise<FirebaseResponse> => {
  return fetch(`${baseUrl}/saveRamenPreference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  })
    .then((response) => response.json())
    .then((result: FirebaseResponse) => {
      return result
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
  return fetch(`${baseUrl}/loadRamenPreference`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((result: FirebaseResponse) => {
      return result
    })
    .catch((error: any) => {
      console.error('Error loading email:', error)
      return {
        success: false,
        message: 'Failed to load email'
      }
    })
}

export const deleteEmailFromFirestore = (): Promise<FirebaseResponse> => {
  return fetch(`${baseUrl}/deleteRamenPreference`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((result: FirebaseResponse) => {
      return result
    })
    .catch((error: any) => {
      console.error('Error deleting email:', error)
      return {
        success: false,
        message: 'Failed to delete email'
      }
    })
} 