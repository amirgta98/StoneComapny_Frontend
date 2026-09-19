/**
 * Standard AppError for clean exception handling across Domain, Application, and Presentation layers.
 * Provides machine-readable error codes, HTTP status codes, and localized Persian messages.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 400,
    code: string = "BAD_REQUEST",
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message: string, code = "BAD_REQUEST", details?: unknown) {
    return new AppError(message, 400, code, details);
  }

  static unauthorized(message = "احراز هویت انجام نشده است", code = "UNAUTHORIZED") {
    return new AppError(message, 401, code);
  }

  static forbidden(message = "دسترسی به این بخش مجاز نمی‌باشد", code = "FORBIDDEN") {
    return new AppError(message, 403, code);
  }

  static notFound(message = "مورد درخواستی یافت نشد", code = "NOT_FOUND") {
    return new AppError(message, 404, code);
  }

  static conflict(message: string, code = "CONFLICT", details?: unknown) {
    return new AppError(message, 409, code, details);
  }

  static unprocessable(message: string, code = "UNPROCESSABLE_ENTITY", details?: unknown) {
    return new AppError(message, 422, code, details);
  }

  static internal(message = "خطای داخلی سرور رخ داده است", code = "INTERNAL_ERROR") {
    return new AppError(message, 500, code);
  }
}
