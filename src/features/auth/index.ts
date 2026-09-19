/**
 * Auth feature — unified login/sign-up via mobile number + OTP.
 *
 * Session/permission primitives (AuthContext, RBAC matrix, tenant scope,
 * mock API layer) live in `@/auth` per the access-control skill — this
 * feature only owns the login UI. Backend calls go through
 * `@/auth/mock/mockAuthApi` so the real API can be wired up without
 * touching this component.
 */
export { LoginForm } from "./components/login-form";
export { LoginPage } from "./components/login-page";
export { OtpInput } from "./components/otp-input";
export { phoneSchema, type PhoneFormValues } from "./schemas/login";