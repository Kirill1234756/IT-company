export interface ClientFormData {
  // Questions answers
  companyDescription: string
  task: string
  solutionVision: string
  expectations: string
  budget: string

  // Contact information
  name: string
  company: string
  phone: string
  email: string
  attachedFile: File | null

  // Privacy policy
  privacyAccepted: boolean
}

export interface ClientFormErrors {
  companyDescription?: string
  task?: string
  solutionVision?: string
  expectations?: string
  budget?: string
  name?: string
  company?: string
  phone?: string
  email?: string
  file?: string
  privacy?: string
}

export interface ClientFormSubmissionResponse {
  success: boolean
  message: string
  clientId?: string
}












