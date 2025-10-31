export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors?: Record<string, string[]>) {
    super(400, message, 'VALIDATION_ERROR');
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(404, message, 'NOT_FOUND');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export function handleError(error: any): { statusCode: number; body: any } {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        success: false,
        error: error.message,
        code: error.code,
        ...(error instanceof ValidationError && { errors: error.errors }),
      },
    };
  }

  console.error('Unexpected error:', error);
  return {
    statusCode: 500,
    body: {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  };
}
