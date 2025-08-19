import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

// Error types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  INTERNAL = 'INTERNAL_ERROR'
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly details?: any

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message)
    this.type = type
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.details = details

    Error.captureStackTrace(this, this.constructor)
  }
}

// Error response interface
interface ErrorResponse {
  success: false
  error: string
  type: ErrorType
  statusCode: number
  details?: any
  timestamp: string
  requestId?: string
}

// Error handler middleware
export function errorHandler() {
  return async function errorHandlerMiddleware(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      return await handler(request)
    } catch (error) {
      console.error('API Error:', error)
      return handleError(error, request)
    }
  }
}

// Main error handling function
function handleError(error: unknown, request: NextRequest): NextResponse {
  let appError: AppError

  // Convert known error types to AppError
  if (error instanceof AppError) {
    appError = error
  } else if (error instanceof z.ZodError) {
    appError = new AppError(
      'Validation failed',
      ErrorType.VALIDATION,
      400,
      true,
      error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }))
    )
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    appError = handlePrismaError(error)
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    appError = new AppError(
      'Database error occurred',
      ErrorType.DATABASE,
      500,
      false
    )
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    appError = new AppError(
      'Invalid database query',
      ErrorType.VALIDATION,
      400,
      true
    )
  } else if (error instanceof Error) {
    // Generic error
    appError = new AppError(
      error.message || 'An unexpected error occurred',
      ErrorType.INTERNAL,
      500,
      false
    )
  } else {
    // Unknown error type
    appError = new AppError(
      'An unexpected error occurred',
      ErrorType.INTERNAL,
      500,
      false
    )
  }

  // Create error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: appError.message,
    type: appError.type,
    statusCode: appError.statusCode,
    timestamp: new Date().toISOString(),
    requestId: generateRequestId()
  }

  // Add details for operational errors
  if (appError.isOperational && appError.details) {
    errorResponse.details = appError.details
  }

  // Log error for monitoring (exclude sensitive information)
  logError(appError, request, errorResponse.requestId!)

  return new NextResponse(
    JSON.stringify(errorResponse),
    {
      status: appError.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': errorResponse.requestId!
      }
    }
  )
}

// Handle Prisma-specific errors
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const field = error.meta?.target as string[]
      return new AppError(
        `A record with this ${field?.[0] || 'value'} already exists`,
        ErrorType.CONFLICT,
        409,
        true,
        { field: field?.[0], constraint: 'unique' }
      )
    
    case 'P2025':
      // Record not found
      return new AppError(
        'The requested record was not found',
        ErrorType.NOT_FOUND,
        404,
        true
      )
    
    case 'P2003':
      // Foreign key constraint violation
      return new AppError(
        'Cannot perform this operation due to related records',
        ErrorType.CONFLICT,
        409,
        true,
        { constraint: 'foreign_key' }
      )
    
    case 'P2014':
      // Required relation violation
      return new AppError(
        'The change you are trying to make would violate the required relation',
        ErrorType.VALIDATION,
        400,
        true
      )
    
    default:
      return new AppError(
        'A database error occurred',
        ErrorType.DATABASE,
        500,
        false,
        { code: error.code }
      )
  }
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Log error for monitoring
function logError(error: AppError, request: NextRequest, requestId: string): void {
  const logData = {
    requestId,
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    error: {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      stack: error.stack,
      isOperational: error.isOperational
    }
  }

  // In production, you would send this to a logging service
  // For now, we'll just log to console
  if (error.statusCode >= 500) {
    console.error('Server Error:', JSON.stringify(logData, null, 2))
  } else {
    console.warn('Client Error:', JSON.stringify(logData, null, 2))
  }
}

// Predefined error creators
export const errors = {
  notFound: (resource: string = 'Resource') =>
    new AppError(`${resource} not found`, ErrorType.NOT_FOUND, 404),
  
  unauthorized: (message: string = 'Authentication required') =>
    new AppError(message, ErrorType.AUTHENTICATION, 401),
  
  forbidden: (message: string = 'Insufficient permissions') =>
    new AppError(message, ErrorType.AUTHORIZATION, 403),
  
  validation: (message: string, details?: any) =>
    new AppError(message, ErrorType.VALIDATION, 400, true, details),
  
  conflict: (message: string, details?: any) =>
    new AppError(message, ErrorType.CONFLICT, 409, true, details),
  
  rateLimit: (message: string = 'Too many requests') =>
    new AppError(message, ErrorType.RATE_LIMIT, 429),
  
  internal: (message: string = 'Internal server error') =>
    new AppError(message, ErrorType.INTERNAL, 500, false),
  
  database: (message: string = 'Database error') =>
    new AppError(message, ErrorType.DATABASE, 500, false),
  
  externalApi: (message: string = 'External API error') =>
    new AppError(message, ErrorType.EXTERNAL_API, 502, false)
}
