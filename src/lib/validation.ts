import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// HTML sanitization function
export function sanitizeHtml(input: string): string {
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove dangerous HTML attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '') // onclick, onload, etc.
  sanitized = sanitized.replace(/\s*javascript\s*:/gi, '') // javascript: protocol
  sanitized = sanitized.replace(/\s*vbscript\s*:/gi, '') // vbscript: protocol
  sanitized = sanitized.replace(/\s*data\s*:/gi, '') // data: protocol (can be dangerous)
  
  // Remove dangerous HTML tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea']
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi')
    sanitized = sanitized.replace(regex, '')
  })
  
  return sanitized.trim()
}

// SQL injection protection
export function sanitizeSqlInput(input: string): string {
  // Remove or escape dangerous SQL keywords and characters
  return input
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/\b(DROP|DELETE|TRUNCATE|ALTER|CREATE|INSERT|UPDATE|EXEC|EXECUTE|UNION|SELECT)\b/gi, '') // Remove SQL keywords
    .trim()
}

// XSS protection for user input
export function sanitizeUserInput(input: any): any {
  if (typeof input === 'string') {
    return sanitizeHtml(input)
  } else if (Array.isArray(input)) {
    return input.map(sanitizeUserInput)
  } else if (input && typeof input === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeUserInput(value)
    }
    return sanitized
  }
  return input
}

// Validation middleware wrapper
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return async function validationMiddleware(
    request: NextRequest,
    handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      // Parse request body
      let body: any = {}
      
      if (request.method !== 'GET' && request.method !== 'DELETE') {
        const contentType = request.headers.get('content-type')
        
        if (contentType?.includes('application/json')) {
          body = await request.json()
        } else if (contentType?.includes('multipart/form-data')) {
          const formData = await request.formData()
          body = Object.fromEntries(formData.entries())
        } else if (contentType?.includes('application/x-www-form-urlencoded')) {
          const formData = await request.formData()
          body = Object.fromEntries(formData.entries())
        }
      }
      
      // Sanitize input
      const sanitizedBody = sanitizeUserInput(body)
      
      // Validate with schema
      const validatedData = schema.parse(sanitizedBody)
      
      // Call handler with validated data
      return await handler(request, validatedData)
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: 'Validation error',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      console.error('Validation middleware error:', error)
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Invalid request data'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}

// Common validation schemas
export const commonSchemas = {
  // Pagination schema
  pagination: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  }),
  
  // Search schema
  search: z.object({
    search: z.string().max(200).optional(),
    filters: z.record(z.any()).optional()
  }),
  
  // ID parameter schema
  id: z.object({
    id: z.string().min(1, 'ID is required')
  }),
  
  // Email schema
  email: z.string().email('Invalid email format').max(254),
  
  // Password schema
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  // Phone schema
  phone: z.string()
    .regex(/^(\+216|00216)?[2459]\d{7}$/, 'Invalid Tunisian phone number format')
    .optional(),
  
  // URL schema
  url: z.string().url('Invalid URL format').optional(),
  
  // File upload schema
  fileUpload: z.object({
    filename: z.string().min(1, 'Filename is required'),
    mimetype: z.string().min(1, 'MIME type is required'),
    size: z.number().positive('File size must be positive')
  })
}

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS attacks
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // HTTPS enforcement (in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  )
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}
