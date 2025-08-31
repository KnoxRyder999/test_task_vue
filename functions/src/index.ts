import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import cors from 'cors'

admin.initializeApp()

// Initialize CORS middleware
const corsHandler = cors({ origin: true })

const db = admin.firestore()

// Collection name: "ramen_preferences" - because ramen is my favorite dish and this collection stores user preferences like emails
const COLLECTION_NAME = 'ramen_preferences'

// Type definitions for better type safety
interface EmailData {
  email: string
  timestamp: admin.firestore.Timestamp
  lastUpdated: admin.firestore.Timestamp
  version: string
}

interface ValidationResult {
  isValid: boolean
  error?: string
}

interface ResponseData {
  success: boolean
  message: string
  data?: any
  timestamp: string
}

// Input validation helper
function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email must be a non-empty string' }
  }
  
  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    return { isValid: false, error: 'Email cannot be empty' }
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Invalid email format' }
  }
  
  // Length validation
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long' }
  }
  
  return { isValid: true }
}

// Response helper
function createResponse(success: boolean, message: string, data?: any): ResponseData {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  }
}

export const saveRamenPreference = functions.https.onRequest((req: functions.https.Request, res: functions.Response) => {
  return corsHandler(req, res, () => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('')
      return
    }
    
    if (req.method !== 'POST') {
      res.status(405).json(createResponse(false, 'Method not allowed'))
      return
    }
    
    try {
      const { email } = req.body || {}
      const validation = validateEmail(email)
      
      if (!validation.isValid) {
        res.status(400).json(createResponse(false, validation.error || 'Invalid email provided'))
        return
      }

      const validatedEmail = email.trim().toLowerCase()
      
      // Using Promise then/catch as required (no async/await) - for production
      db.collection(COLLECTION_NAME).doc('user_email').set({
        email: validatedEmail,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        version: '1.0'
      })
        .then(() => {
          console.log(`Email saved successfully: ${validatedEmail}`)
          res.status(200).json(createResponse(true, 'Email saved successfully', {
            email: validatedEmail,
            timestamp: new Date(),
            version: '1.0'
          }))
        })
        .catch((error: any) => {
          console.error('Error saving email to Firestore:', error)
          res.status(500).json(createResponse(false, 'Failed to save email to database'))
        })
        
    } catch (error: any) {
      console.error('Unexpected error in saveRamenPreference:', error)
      res.status(500).json(createResponse(false, 'Internal server error'))
    }
  })
})

export const loadRamenPreference = functions.https.onRequest((req: functions.https.Request, res: functions.Response) => {
  return corsHandler(req, res, () => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('')
      return
    }
    
    if (req.method !== 'GET') {
      res.status(405).json(createResponse(false, 'Method not allowed'))
      return
    }
    
    try {
      // Using Promise then/catch as required (no async/await) - for production
      db.collection(COLLECTION_NAME).doc('user_email').get()
        .then((doc: admin.firestore.DocumentSnapshot) => {
          if (doc.exists) {
            const docData = doc.data() as EmailData
            console.log('Email loaded successfully from Firestore')
            res.status(200).json(createResponse(true, 'Email loaded successfully', {
              email: docData?.email || '',
              timestamp: docData?.timestamp?.toDate() || new Date(),
              version: docData?.version || '1.0',
              lastUpdated: docData?.lastUpdated?.toDate() || new Date()
            }))
          } else {
            console.log('No email found in Firestore')
            res.status(404).json(createResponse(false, 'No email found', null))
          }
        })
        .catch((error: any) => {
          console.error('Error loading email from Firestore:', error)
          res.status(500).json(createResponse(false, 'Failed to load email from database'))
        })
        
    } catch (error: any) {
      console.error('Unexpected error in loadRamenPreference:', error)
      res.status(500).json(createResponse(false, 'Internal server error'))
    }
  })
})

// New function: Get email statistics
export const getEmailStats = functions.https.onRequest((req: functions.https.Request, res: functions.Response) => {
  return corsHandler(req, res, () => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('')
      return
    }
    
    if (req.method !== 'GET') {
      res.status(405).json(createResponse(false, 'Method not allowed'))
      return
    }
    
    try {
      db.collection(COLLECTION_NAME).get()
        .then((snapshot: admin.firestore.QuerySnapshot) => {
          const totalEmails = snapshot.size
          const emails = snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => doc.data() as EmailData)
          
          const stats = {
            totalEmails,
            domains: emails.reduce((acc: Record<string, number>, emailData: EmailData) => {
              if (emailData.email) {
                const domain = emailData.email.split('@')[1] || 'unknown'
                acc[domain] = (acc[domain] || 0) + 1
              }
              return acc
            }, {}),
            lastUpdated: emails.reduce((latest: Date | null, emailData: EmailData) => {
              if (emailData.lastUpdated) {
                const timestamp = emailData.lastUpdated.toDate()
                return timestamp && (!latest || timestamp > latest) ? timestamp : latest
              }
              return latest
            }, null)
          }
          
          console.log('Email statistics retrieved successfully')
          res.status(200).json(createResponse(true, 'Email statistics retrieved successfully', stats))
        })
        .catch((error: any) => {
          console.error('Error retrieving email statistics:', error)
          res.status(500).json(createResponse(false, 'Failed to retrieve email statistics'))
        })
        
    } catch (error: any) {
      console.error('Unexpected error in getEmailStats:', error)
      res.status(500).json(createResponse(false, 'Internal server error'))
    }
  })
})

// New function: Delete email preference
export const deleteRamenPreference = functions.https.onRequest((req: functions.https.Request, res: functions.Response) => {
  return corsHandler(req, res, () => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('')
      return
    }
    
    if (req.method !== 'DELETE') {
      res.status(405).json(createResponse(false, 'Method not allowed'))
      return
    }
    
    try {
      db.collection(COLLECTION_NAME).doc('user_email').delete()
        .then(() => {
          console.log('Email preference deleted successfully')
          res.status(200).json(createResponse(true, 'Email preference deleted successfully'))
        })
        .catch((error: any) => {
          console.error('Error deleting email preference:', error)
          res.status(500).json(createResponse(false, 'Failed to delete email preference'))
        })
        
    } catch (error: any) {
      console.error('Unexpected error in deleteRamenPreference:', error)
      res.status(500).json(createResponse(false, 'Internal server error'))
    }
  })
}) 