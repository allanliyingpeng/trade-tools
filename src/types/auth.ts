export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  displayName?: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface AuthUser {
  id: string
  email: string
  displayName?: string
  createdAt: string
  updatedAt: string
}

export interface AuthError {
  message: string
  code?: string
}