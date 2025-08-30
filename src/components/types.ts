export interface PasswordVerifyRequest {
  password: string;
}
export interface PasswordVerifyResponse {
  success: boolean;
  message: string;
}

export interface RequestOTPRequest {
  email: string;
}
export interface RequestOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}
export interface VerifyOTPResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}