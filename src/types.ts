export interface EmailData {
  email: string
  timestamp: Date
}

export interface FirebaseResponse {
  success: boolean
  message: string
  data?: EmailData
}

export interface EmailValidationResult {
  isValid: boolean
  suggestions: string[]
  warnings: string[]
  confidence: number
  errors?: string[]
} 