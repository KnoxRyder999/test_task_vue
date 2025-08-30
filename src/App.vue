<template>
  <div id="app">
    <h1>{{ messages.title }}</h1>
    
    <div class="email-form">
      <div class="input-container">
        <input 
          v-model="email" 
          type="email" 
          :placeholder="messages.emailPlaceholder"
          class="email-input"
          :class="{ 'error-input': hasValidationErrors }"
          @input="onEmailInput"
          @keyup.enter="saveEmail"
        />
        <div class="ai-validation" v-if="validationResult">
          <!-- Loading state -->
          <div v-if="isValidating" class="loading">
            🔍 {{ messages.aiValidation.loading }}
          </div>
          
          <!-- Errors -->
          <div v-if="validationResult.errors && validationResult.errors.length > 0" class="errors">
            <div v-for="error in validationResult.errors" :key="error" class="error">
              ❌ {{ error }}
            </div>
          </div>
          
          <!-- Suggestions -->
          <div v-if="validationResult.suggestions.length > 0" class="suggestions">
            <div v-for="suggestion in validationResult.suggestions" :key="suggestion" class="suggestion">
              💡 {{ suggestion }}
            </div>
          </div>
          
          <!-- Warnings -->
          <div v-if="validationResult.warnings.length > 0" class="warnings">
            <div v-for="warning in validationResult.warnings" :key="warning" class="warning">
              ⚠️ {{ warning }}
            </div>
          </div>
          
          <!-- Validation summary -->
          <div v-if="validationResult.isValid" class="validation-summary">
            <small>Confidence: {{ Math.round(validationResult.confidence * 100) }}%</small>
          </div>
        </div>
      </div>
      <button 
        @click="saveEmail" 
        :disabled="!email || isSaving || !isEmailValid"
        class="save-button"
        :class="{ 'saving': isSaving }"
      >
        <span v-if="isSaving" class="loading-spinner">⏳</span>
        {{ isSaving ? messages.saving : messages.rememberButton }}
      </button>
    </div>

    <div class="saved-email" v-if="savedEmail">
      <p><strong>{{ messages.savedEmail }}</strong></p>
      <p class="email-display">{{ savedEmail }}</p>
      <div class="email-actions">
        <button @click="editEmail" class="edit-button">
          ✏️ {{ messages.editEmail }}
        </button>
        <button @click="deleteEmail" class="delete-button">
          🗑️ {{ messages.deleteEmail }}
        </button>
      </div>
    </div>
    
    <div class="no-email" v-else>
      <p>{{ messages.noEmailSaved }}</p>
    </div>

    <div class="status" v-if="statusMessage">
      <p :class="statusClass">{{ statusMessage }}</p>
      <button v-if="statusClass === 'error'" @click="clearStatus" class="clear-status">
        ✕
      </button>
    </div>

    <!-- Email statistics -->
    <div class="email-stats" v-if="emailStats">
      <h3>{{ messages.emailStats.title }}</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">{{ emailStats.totalEmails }}</span>
          <span class="stat-label">{{ messages.emailStats.totalEmails }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ Object.keys(emailStats.domains).length }}</span>
          <span class="stat-label">{{ messages.emailStats.uniqueDomains }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { messages } from './messages'
import { saveEmailToFirestore, loadEmailFromFirestore } from './emailService'
import { createDebouncedValidator } from './aiValidationService'
import type { EmailData, EmailValidationResult, FirebaseResponse } from './types'

// I love exploring hidden cafes in Tokyo's backstreets - the best ramen is always where you least expect it!
const email = ref('')
const savedEmail = ref('')
const isSaving = ref(false)
const statusMessage = ref('')
const statusClass = ref('')
const validationResult = ref<EmailValidationResult | null>(null)
const isEmailValid = ref(false)
const isValidating = ref(false)
const emailStats = ref<any>(null)

// Computed properties
const hasValidationErrors = computed(() => {
  return validationResult.value?.errors && validationResult.value.errors.length > 0
})

const saveEmail = () => {
  if (!email.value || !isEmailValid.value) return
  
  isSaving.value = true
  statusMessage.value = ''
  
  saveEmailToFirestore(email.value)
    .then((response: FirebaseResponse) => {
      if (response.success) {
        savedEmail.value = email.value
        statusMessage.value = messages.emailSaved
        statusClass.value = 'success'
        email.value = ''
        clearValidation()
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          if (statusClass.value === 'success') {
            clearStatus()
          }
        }, 3000)
      } else {
        statusMessage.value = response.message || messages.errorSaving
        statusClass.value = 'error'
      }
    })
    .catch((error: any) => {
      console.error('Save email error:', error)
      statusMessage.value = messages.errorSaving
      statusClass.value = 'error'
    })
    .finally(() => {
      isSaving.value = false
    })
}

// Clear validation when email is cleared
const clearValidation = () => {
  validationResult.value = null
  isEmailValid.value = false
  isValidating.value = false
}

// Clear status message
const clearStatus = () => {
  statusMessage.value = ''
  statusClass.value = ''
}

// Edit email functionality
const editEmail = () => {
  email.value = savedEmail.value
  savedEmail.value = ''
  // Trigger validation for the loaded email
  onEmailInput()
}

// Delete email functionality
const deleteEmail = () => {
  if (confirm(messages.confirmDelete)) {
    savedEmail.value = ''
    clearStatus()
    // Here you could call a delete function if implemented
  }
}

// AI-powered email validation
const debouncedValidator = createDebouncedValidator(500)

const onEmailInput = () => {
  if (email.value.trim()) {
    isValidating.value = true
    debouncedValidator(email.value, (result: EmailValidationResult) => {
      validationResult.value = result
      isEmailValid.value = result.isValid
      isValidating.value = false
    })
  } else {
    clearValidation()
  }
}

const loadEmail = () => {
  loadEmailFromFirestore()
    .then((response: FirebaseResponse) => {
      if (response.success && response.data) {
        savedEmail.value = response.data.email
      }
    })
    .catch((error: any) => {
      console.error('Load email error:', error)
      statusMessage.value = messages.errorLoading
      statusClass.value = 'error'
    })
}

onMounted(() => {
  loadEmail()
})

// Watch for email changes to clear validation when empty
watch(email, (newValue) => {
  if (!newValue || !newValue.trim()) {
    clearValidation()
  }
})
</script>

<style scoped>
#app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.email-form {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  align-items: flex-start;
}

.input-container {
  flex: 1;
  position: relative;
}

.email-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.email-input.error-input {
  border-color: #d32f2f;
  background-color: #fff5f5;
}

.save-button {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  min-width: 120px;
}

.save-button:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-1px);
}

.save-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.save-button.saving {
  background-color: #ff9800;
}

.loading-spinner {
  margin-right: 8px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.saved-email, .no-email {
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 20px;
}

.email-display {
  font-size: 18px;
  color: #2196F3;
  font-weight: bold;
  margin-bottom: 15px;
}

.email-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.edit-button, .delete-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #2196F3;
  color: white;
}

.edit-button:hover {
  background-color: #1976D2;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.ai-validation {
  margin-top: 10px;
  font-size: 14px;
}

.loading {
  color: #666;
  margin-bottom: 5px;
  padding: 5px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-style: italic;
}

.errors {
  margin-bottom: 10px;
}

.error {
  color: #d32f2f;
  margin-bottom: 5px;
  padding: 5px;
  background-color: #ffebee;
  border-radius: 4px;
  border-left: 3px solid #d32f2f;
}

.suggestion {
  color: #2196F3;
  margin-bottom: 5px;
  padding: 5px;
  background-color: #e3f2fd;
  border-radius: 4px;
}

.warning {
  color: #ff9800;
  margin-bottom: 5px;
  padding: 5px;
  background-color: #fff3e0;
  border-radius: 4px;
}

.validation-summary {
  margin-top: 10px;
  text-align: right;
  color: #666;
  font-size: 12px;
}

.status {
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  position: relative;
  margin-bottom: 20px;
}

.clear-status {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
}

.clear-status:hover {
  opacity: 1;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.email-stats {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.email-stats h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #2196F3;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  text-align: center;
}

@media (max-width: 480px) {
  .email-form {
    flex-direction: column;
    gap: 15px;
  }
  
  .save-button {
    width: 100%;
  }
  
  .email-actions {
    flex-direction: column;
  }
}
</style> 