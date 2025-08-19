import { NextResponse } from 'next/server'

// Standard API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Success response helper
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message })
  }, { status })
}

// Error response helper
export function errorResponse(
  error: string,
  status: number = 500
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error
  }, { status })
}

// Validation error response helper
export function validationErrorResponse(
  errors: any[],
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: 'Validation error',
    details: errors
  }, { status })
}

// Pagination helper
export function createPaginationInfo(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit)
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

// Property type definitions for API responses
export interface PropertyResponse {
  id: string
  title: string
  description: string
  price: number
  type: string
  status: string
  surface: number
  rooms: number
  bedrooms: number
  bathrooms: number
  floor?: number
  totalFloors?: number
  yearBuilt?: number
  energyClass?: string
  address: string
  city: string
  zipCode: string
  country: string
  latitude?: number
  longitude?: number
  features?: any
  images?: string[]
  documents?: string[]
  virtualTour?: string
  videoUrl?: string
  isPublished: boolean
  isFeatured: boolean
  views: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  user?: {
    id: string
    name?: string
    email: string
    phone?: string
    image?: string
  }
  _count?: {
    favorites: number
    reviews: number
    appointments: number
  }
  reviews?: Array<{
    id: string
    rating: number
    comment?: string
    createdAt: string
    user: {
      id: string
      name?: string
      image?: string
    }
  }>
}

export interface PropertyStats {
  overview: {
    total: number
    published: number
    draft: number
    featured: number
    newThisPeriod: number
    averagePrice: number
    minPrice: number
    maxPrice: number
  }
  views: {
    total: number
    thisPeriod: number
  }
  byType: Array<{
    type: string
    count: number
  }>
  byStatus: Array<{
    status: string
    count: number
  }>
  topViewed: Array<{
    id: string
    title: string
    price: number
    city: string
    views: number
    images?: string[]
    type: string
  }>
  recent: Array<{
    id: string
    title: string
    price: number
    city: string
    createdAt: string
    images?: string[]
    type: string
  }>
  period: string
  generatedAt: string
}
