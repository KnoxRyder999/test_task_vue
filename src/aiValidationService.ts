// AI-powered email validation service
// Generated with ChatGPT assistance for intelligent email validation and suggestions

export interface EmailValidationResult {
  isValid: boolean;
  suggestions: string[];
  warnings: string[];
  confidence: number;
  errors?: string[];
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
  'outllok.com': 'outlook.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'hotmil.com': 'hotmail.com',
  'yhoo.com': 'yahoo.com'
};

const disposableDomains = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'throwawaymail.com', 'temp-mail.org',
  'sharklasers.com', 'getairmail.com', 'mailnesia.com',
  'trashmail.com', 'spam4.me', 'bccto.me'
];

const professionalKeywords = ['test', '123', 'demo', 'temp', 'fake', 'example'];

export function smartEmailValidation(email: string): EmailValidationResult {
  const result: EmailValidationResult = {
    isValid: false,
    suggestions: [],
    warnings: [],
    confidence: 0,
    errors: []
  };

  try {
    // Input validation
    if (!email || typeof email !== 'string') {
      result.errors?.push('Invalid input: email must be a non-empty string');
      return result;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      result.errors?.push('Email cannot be empty');
      return result;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      result.suggestions.push('Please enter a valid email address format (user@domain.com)');
      return result;
    }

    const [localPart, domain] = trimmedEmail.split('@');
    
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
    const hasUnprofessionalKeywords = professionalKeywords.some(keyword => 
      localPart.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasUnprofessionalKeywords || localPart.length < 3) {
      result.suggestions.push('Consider using a more professional email address for business communications');
    }

    // Domain-specific suggestions
    if (domain === 'gmail.com' && localPart.length > 20) {
      result.suggestions.push('Gmail addresses work best when they are concise and memorable');
    }

    // Length validation
    if (localPart.length > 64) {
      result.warnings.push('Local part of email is very long, which may cause delivery issues');
    }

    if (domain.length > 253) {
      result.warnings.push('Domain name is very long, which may cause delivery issues');
    }

    // Special character warnings
    if (localPart.includes('+') && !localPart.includes('+', localPart.indexOf('+') + 1)) {
      result.suggestions.push('Gmail supports + aliases (e.g., user+tag@gmail.com) for organization');
    }

    result.isValid = true;
    result.confidence = calculateConfidence(result);
    
    if (result.suggestions.length === 0 && result.warnings.length === 0) {
      result.suggestions.push('Email looks good!');
    }

  } catch (error) {
    result.errors?.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    result.confidence = 0;
  }

  return result;
}

function calculateConfidence(result: EmailValidationResult): number {
  let confidence = 0.9; // Base confidence
  
  // Reduce confidence based on warnings
  confidence -= result.warnings.length * 0.1;
  
  // Reduce confidence if there are errors
  if (result.errors && result.errors.length > 0) {
    confidence -= 0.3;
  }
  
  // Ensure confidence is between 0 and 1
  return Math.max(0, Math.min(1, confidence));
}

// Real-time validation with debouncing for better UX
export function createDebouncedValidator(delay: number = 500) {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (email: string, callback: (result: EmailValidationResult) => void) => {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      if (email.trim()) {
        const result = smartEmailValidation(email);
        callback(result);
      }
    }, delay);
  };
}

// Utility function to get validation summary
export function getValidationSummary(result: EmailValidationResult): string {
  if (!result.isValid) {
    return 'Email validation failed';
  }
  
  const suggestionCount = result.suggestions.length;
  const warningCount = result.warnings.length;
  
  if (suggestionCount === 0 && warningCount === 0) {
    return 'Email is perfect!';
  }
  
  let summary = '';
  if (suggestionCount > 0) {
    summary += `${suggestionCount} suggestion${suggestionCount > 1 ? 's' : ''}`;
  }
  
  if (warningCount > 0) {
    if (summary) summary += ', ';
    summary += `${warningCount} warning${warningCount > 1 ? 's' : ''}`;
  }
  
  return summary;
} 