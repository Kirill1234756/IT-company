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

  // Anti-bot (client only)
  honeypot: string;
  formStartedAt: number;
  [key: string]: string | number | File | boolean | null;
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
  attachedFile?: string
  privacyAccepted?: string
  honeypot?: string
  formStartedAt?: string
  [key: string]: string | undefined;
}

export interface ClientFormSubmissionResponse {
  success: boolean
  message: string
  clientId?: string
}
















