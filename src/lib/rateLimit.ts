import { NextRequest, NextResponse } from 'next/server'

// In-memory store for rate limiting (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean // Don't count successful requests
  keyGenerator?: (request: NextRequest) => string // Custom key generator
}

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    keyGenerator = (req) => getClientIP(req)
  } = options

  return async function rateLimitMiddleware(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const key = keyGenerator(request)
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    cleanupOldEntries(windowStart)

    // Get current count for this key
    const current = requestCounts.get(key)
    
    if (!current || current.resetTime <= now) {
      // First request or window expired
      requestCounts.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
    } else if (current.count >= maxRequests) {
      // Rate limit exceeded
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: message,
          retryAfter: Math.ceil((current.resetTime - now) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(current.resetTime / 1000).toString(),
            'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString()
          }
        }
      )
    } else {
      // Increment count
      current.count += 1
    }

    // Execute the handler
    const response = await handler(request)

    // If skipSuccessfulRequests is true and response is successful, decrement count
    if (skipSuccessfulRequests && response.status >= 200 && response.status < 400) {
      const entry = requestCounts.get(key)
      if (entry && entry.count > 0) {
        entry.count -= 1
      }
    }

    // Add rate limit headers to response
    const entry = requestCounts.get(key)
    if (entry) {
      response.headers.set('X-RateLimit-Limit', maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count).toString())
      response.headers.set('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString())
    }

    return response
  }
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback to a default if no IP can be determined
  return 'unknown'
}

// Clean up old entries to prevent memory leaks
function cleanupOldEntries(windowStart: number) {
  for (const [key, entry] of requestCounts.entries()) {
    if (entry.resetTime <= windowStart) {
      requestCounts.delete(key)
    }
  }
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // Strict rate limit for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.'
  },
  
  // Moderate rate limit for API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'API rate limit exceeded, please slow down.'
  },
  
  // Lenient rate limit for file uploads
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    message: 'Upload rate limit exceeded, please wait before uploading more files.'
  },
  
  // Very strict for sensitive operations
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 attempts per hour
    message: 'Too many attempts for sensitive operation, please try again later.'
  }
}