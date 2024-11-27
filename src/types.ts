export interface FormQuestion {
  id: string
  type: 'text' | 'longText' | 'number' | 'multipleChoice' | 'checkbox' | 'date' | 'email' | 'signature' | 'statement' | 'url' | 'singleSelect' | 'fileUpload' | 'contactInfo'
  question: string
  options?: string[]
  statement?: string
  image?: {
    url: string
    placement: 'stack' | 'split' | 'wallpaper'
    position?: 'left' | 'right'
  }
  fileUploadConfig?: {
    maxFiles?: number
    maxFileSize?: number
    acceptedFileTypes?: string[]
  }
  contactFields?: {
    firstName: boolean
    lastName: boolean
    email: boolean
    phone: boolean
    company: boolean
  }
  required?: boolean
  logic?: LogicRule[]
  visible?: boolean
}

export interface LogicRule {
  id: string
  questionId: string
  condition: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan'
  value: string | number
  action: 'show' | 'hide'
  targetQuestionId: string
}

export interface Form {
  id: string
  title: string
  description?: string
  questions: FormQuestion[]
  responseCount: number
  buttonText?: string
  textAlign?: 'left' | 'center' | 'right'
  submitButtonColor?: string
  titleColor?: string
  questionColor?: string
  descriptionColor?: string
  backgroundColor?: string
  redirectUrl?: string
  userId?: string
  thankYouTitle?: string
  thankYouText?: string
  thankYouButtonText?: string
  emailNotifications?: {
    enabled: boolean
    email: string
    subject?: string
    template?: string
    ccEmails?: string[]
    sendCopy?: boolean
    replyTo?: string
  }
  capturePartialSubmissions?: boolean
  saveAndResume?: {
    enabled: boolean
    autoSaveInterval?: number
    emailTemplate?: string
  }
  isPro?: boolean
}