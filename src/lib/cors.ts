import { NextRequest, NextResponse } from 'next/server'

interface CorsOptions {
  origin?: string | string[] | boolean
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
  preflightContinue?: boolean
  optionsSuccessStatus?: number
}

const defaultOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.NEXTAUTH_URL!, 'https://yourdomain.com'] 
    : true, // Allow all origins in development
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-Request-ID'
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
}

export function cors(options: CorsOptions = {}) {
  const opts = { ...defaultOptions, ...options }

  return function corsMiddleware(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    return new Promise(async (resolve) => {
      const origin = request.headers.get('origin')
      const method = request.method

      // Handle preflight requests
      if (method === 'OPTIONS') {
        const response = new NextResponse(null, { 
          status: opts.optionsSuccessStatus || 200 
        })
        
        setCorsHeaders(response, origin, opts)
        resolve(response)
        return
      }

      // Handle actual requests
      try {
        const response = await handler(request)
        setCorsHeaders(response, origin, opts)
        resolve(response)
      } catch (error) {
        // Even error responses should have CORS headers
        const errorResponse = new NextResponse(
          JSON.stringify({ success: false, error: 'Internal Server Error' }),
          { status: 500 }
        )
        setCorsHeaders(errorResponse, origin, opts)
        resolve(errorResponse)
      }
    })
  }
}

function setCorsHeaders(response: NextResponse, origin: string | null, options: CorsOptions) {
  // Handle origin
  if (options.origin === true) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
  } else if (options.origin === false) {
    // Don't set the header
  } else if (typeof options.origin === 'string') {
    response.headers.set('Access-Control-Allow-Origin', options.origin)
  } else if (Array.isArray(options.origin)) {
    if (origin && options.origin.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
  }

  // Handle credentials
  if (options.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // Handle methods
  if (options.methods) {
    response.headers.set('Access-Control-Allow-Methods', options.methods.join(', '))
  }

  // Handle allowed headers
  if (options.allowedHeaders) {
    response.headers.set('Access-Control-Allow-Headers', options.allowedHeaders.join(', '))
  }

  // Handle exposed headers
  if (options.exposedHeaders) {
    response.headers.set('Access-Control-Expose-Headers', options.exposedHeaders.join(', '))
  }

  // Handle max age
  if (options.maxAge !== undefined) {
    response.headers.set('Access-Control-Max-Age', options.maxAge.toString())
  }

  // Vary header for caching
  response.headers.set('Vary', 'Origin')
}

// Predefined CORS configurations
export const corsConfigs = {
  // Strict CORS for production APIs
  strict: {
    origin: [process.env.NEXTAUTH_URL!],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Permissive CORS for development
  development: {
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*']
  },

  // CORS for public APIs (no credentials)
  public: {
    origin: '*',
    credentials: false,
    methods: ['GET', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Origin']
  },

  // CORS for file uploads
  upload: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXTAUTH_URL!] 
      : true,
    credentials: true,
    methods: ['POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-File-Name'],
    maxAge: 3600 // 1 hour
  }
}
