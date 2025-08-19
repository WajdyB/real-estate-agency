import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { errors } from '@/lib/errorHandler'

export type UserRole = 'CLIENT' | 'AGENT' | 'ADMIN'

interface AuthOptions {
  required?: boolean
  roles?: UserRole[]
  skipForMethods?: string[]
}

// Authentication middleware
export function requireAuth(options: AuthOptions = {}) {
  const {
    required = true,
    roles = [],
    skipForMethods = []
  } = options

  return async function authMiddleware(
    request: NextRequest,
    handler: (request: NextRequest, session: any) => Promise<NextResponse>
  ): Promise<NextResponse> {
    // Skip authentication for certain methods
    if (skipForMethods.includes(request.method)) {
      return await handler(request, null)
    }

    try {
      // Get session
      const session = await getServerSession(authOptions)

      // Check if authentication is required
      if (required && !session?.user) {
        throw errors.unauthorized('Authentication required')
      }

      // Check role permissions
      if (session?.user && roles.length > 0) {
        const userRole = session.user.role as UserRole
        if (!roles.includes(userRole)) {
          throw errors.forbidden('Insufficient permissions')
        }
      }

      // Call handler with session
      return await handler(request, session)

    } catch (error) {
      // Re-throw AppErrors
      if (error instanceof Error && 'type' in error) {
        throw error
      }

      // Handle unexpected errors
      console.error('Auth middleware error:', error)
      throw errors.internal('Authentication error')
    }
  }
}

// Role-based middleware shortcuts
export const requireAdmin = () => requireAuth({ 
  required: true, 
  roles: ['ADMIN'] 
})

export const requireAgent = () => requireAuth({ 
  required: true, 
  roles: ['ADMIN', 'AGENT'] 
})

export const requireUser = () => requireAuth({ 
  required: true, 
  roles: ['CLIENT', 'AGENT', 'ADMIN'] 
})

// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuth = () => requireAuth({ 
  required: false 
})

// Resource ownership middleware
export function requireOwnership(getResourceUserId: (request: NextRequest) => Promise<string>) {
  return async function ownershipMiddleware(
    request: NextRequest,
    handler: (request: NextRequest, session: any) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      throw errors.unauthorized('Authentication required')
    }

    // Admin can access everything
    if (session.user.role === 'ADMIN') {
      return await handler(request, session)
    }

    try {
      // Get resource owner ID
      const resourceUserId = await getResourceUserId(request)
      
      // Check ownership
      if (session.user.id !== resourceUserId) {
        throw errors.forbidden('You can only access your own resources')
      }

      return await handler(request, session)

    } catch (error) {
      if (error instanceof Error && 'type' in error) {
        throw error
      }
      
      console.error('Ownership middleware error:', error)
      throw errors.forbidden('Access denied')
    }
  }
}

// API key authentication (for external integrations)
export function requireApiKey() {
  return async function apiKeyMiddleware(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const apiKey = request.headers.get('x-api-key')
    
    if (!apiKey) {
      throw errors.unauthorized('API key required')
    }

    // Validate API key (in production, store hashed keys in database)
    const validApiKeys = process.env.API_KEYS?.split(',') || []
    
    if (!validApiKeys.includes(apiKey)) {
      throw errors.unauthorized('Invalid API key')
    }

    return await handler(request)
  }
}

// Session validation utilities
export function validateSession(session: any): boolean {
  return !!(session?.user?.id && session?.user?.email)
}

export function hasRole(session: any, roles: UserRole[]): boolean {
  if (!session?.user?.role) return false
  return roles.includes(session.user.role as UserRole)
}

export function isAdmin(session: any): boolean {
  return session?.user?.role === 'ADMIN'
}

export function isAgent(session: any): boolean {
  return ['ADMIN', 'AGENT'].includes(session?.user?.role)
}

export function canManageResource(session: any, resourceUserId: string): boolean {
  if (!session?.user) return false
  
  // Admin can manage everything
  if (session.user.role === 'ADMIN') return true
  
  // Users can manage their own resources
  return session.user.id === resourceUserId
}
