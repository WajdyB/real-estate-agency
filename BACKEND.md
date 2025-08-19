# Real Estate Agency Backend Documentation

## Overview

This document provides a comprehensive overview of the Real Estate Agency backend implementation, including all API endpoints, database schema, authentication, and how the system works from a user's perspective.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **Validation**: Zod
- **Language**: TypeScript

## Database Schema

### Core Models

#### User
```typescript
{
  id: string (CUID)
  email: string (unique)
  name: string
  password: string (hashed)
  image: string (URL)
  phone: string
  role: 'CLIENT' | 'AGENT' | 'ADMIN'
  emailVerified: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Property
```typescript
{
  id: string (CUID)
  title: string
  description: string
  price: Decimal
  type: 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'LOFT' | 'VILLA' | 'COMMERCIAL' | 'LAND' | 'PARKING'
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'RENTED' | 'DRAFT'
  surface: number
  rooms: number
  bedrooms: number
  bathrooms: number
  floor: number
  totalFloors: number
  yearBuilt: number
  energyClass: string
  address: string
  city: string
  zipCode: string
  country: string
  latitude: number
  longitude: number
  features: JSON
  images: JSON
  documents: JSON
  virtualTour: string
  videoUrl: string
  isPublished: boolean
  isFeatured: boolean
  views: number
  createdAt: DateTime
  updatedAt: DateTime
  publishedAt: DateTime
  userId: string (foreign key)
}
```

#### Payment
```typescript
{
  id: string (CUID)
  userId: string (foreign key)
  propertyId: string (foreign key)
  stripePaymentId: string (unique)
  amount: Decimal
  currency: string
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' | 'REFUNDED'
  type: 'RESERVATION' | 'DEPOSIT' | 'COMMISSION' | 'SERVICE'
  description: string
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Appointment
```typescript
{
  id: string (CUID)
  userId: string (foreign key)
  propertyId: string (foreign key)
  date: DateTime
  time: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED'
  notes: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Review
```typescript
{
  id: string (CUID)
  userId: string (foreign key)
  propertyId: string (foreign key)
  rating: number (1-5)
  comment: string
  isPublished: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### BlogPost
```typescript
{
  id: string (CUID)
  title: string
  slug: string (unique)
  excerpt: string
  content: string
  image: string (URL)
  isPublished: boolean
  views: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Authentication System

### NextAuth.js Integration

The backend uses NextAuth.js for authentication with the following features:

- **Session Management**: Secure session handling with JWT tokens
- **Role-Based Access Control**: Three user roles (CLIENT, AGENT, ADMIN)
- **Email/Password Authentication**: Traditional login system
- **OAuth Providers**: Support for Google, GitHub, etc. (configurable)
- **Email Verification**: Optional email verification system

### Role Permissions

#### CLIENT (Regular User)
- View published properties
- Create favorites
- Schedule appointments
- Write reviews
- Make payments
- Manage profile
- Create property alerts

#### AGENT (Real Estate Agent)
- All CLIENT permissions
- Create and manage properties
- View appointment requests
- Access basic analytics
- Manage property listings

#### ADMIN (Administrator)
- All AGENT permissions
- Manage all users
- Access full analytics
- Manage system settings
- Moderate reviews
- Manage blog content

## API Endpoints

### 1. Authentication (`/api/auth/*`)

#### Registration
- **POST** `/api/auth/register`
- Creates new user account
- Validates email uniqueness
- Hashes password securely
- Returns user data (without password)

#### Login
- **POST** `/api/auth/[...nextauth]`
- Handled by NextAuth.js
- Returns session token
- Manages user sessions

### 2. Properties (`/api/properties/*`)

#### List Properties
- **GET** `/api/properties`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 12)
  - `search`: Text search
  - `type`: Property type filter
  - `minPrice`/`maxPrice`: Price range
  - `minSurface`: Minimum surface area
  - `rooms`: Minimum number of rooms
  - `city`: City filter
  - `sortBy`: Sort field (default: createdAt)
  - `sortOrder`: asc/desc (default: desc)
  - `featured`: Show only featured properties
  - `published`: Show only published properties

#### Create Property
- **POST** `/api/properties`
- **Authentication**: Required (AGENT/ADMIN)
- **Features**:
  - Validates all property fields
  - Handles image uploads
  - Sets publication date if published
  - Associates with current user

#### Get Single Property
- **GET** `/api/properties/[id]`
- Returns detailed property information
- Includes user data, favorites count, reviews
- Increments view counter

#### Update Property
- **PUT** `/api/properties/[id]`
- **Authentication**: Required (Owner/ADMIN)
- Validates ownership or admin rights
- Updates property information

#### Delete Property
- **DELETE** `/api/properties/[id]`
- **Authentication**: Required (Owner/ADMIN)
- Soft delete or hard delete based on configuration

#### Property Statistics
- **GET** `/api/properties/stats`
- **Authentication**: Required (AGENT/ADMIN)
- Returns property analytics:
  - Total properties
  - Published vs draft
  - Views statistics
  - Type distribution
  - City distribution

#### Featured Properties
- **GET** `/api/properties/featured`
- Returns featured properties for homepage
- Optimized for performance

### 3. Search (`/api/search/*`)

#### Advanced Search
- **GET** `/api/search`
- **Features**:
  - Full-text search across title, description, address, city
  - Multiple filter combinations
  - Price and surface range filtering
  - Location-based filtering
  - Features filtering
  - Sorting and pagination

#### Autocomplete
- **GET** `/api/search/autocomplete`
- **Query Parameters**:
  - `q`: Search query
  - `type`: 'all', 'cities', 'properties'
- **Returns**: Suggestions for cities, properties, addresses

#### Search Filters
- **GET** `/api/search/filters`
- Returns available filter options:
  - Cities list
  - Property types with counts
  - Price ranges
  - Surface ranges
  - Available features

### 4. Users (`/api/users/*`)

#### List Users
- **GET** `/api/users`
- **Authentication**: Required (ADMIN only)
- **Features**:
  - Pagination
  - Search by name, email, phone
  - Role filtering
  - Sorting options

#### Create User
- **POST** `/api/users`
- **Authentication**: Required (ADMIN only)
- Creates new user with specified role
- Validates email uniqueness

#### Get User Profile
- **GET** `/api/users/[id]`
- **Authentication**: Required (Self/ADMIN)
- Returns user data with activity counts

#### Update User
- **PUT** `/api/users/[id]`
- **Authentication**: Required (Self/ADMIN)
- Updates user information
- Handles password changes securely

#### Delete User
- **DELETE** `/api/users/[id]`
- **Authentication**: Required (ADMIN only)
- Prevents self-deletion
- Cascades to related data

#### User Profile Management
- **GET** `/api/users/profile`
- **PUT** `/api/users/profile`
- **POST** `/api/users/profile/change-password`
- **Authentication**: Required (Self)
- Manages current user's profile
- Secure password change functionality

#### User Statistics
- **GET** `/api/users/stats`
- **Authentication**: Required (ADMIN only)
- Returns user analytics:
  - Total users
  - Active vs inactive users
  - New users by period
  - Role distribution
  - User engagement metrics

### 5. Appointments (`/api/appointments/*`)

#### List Appointments
- **GET** `/api/appointments`
- **Authentication**: Required
- **Features**:
  - Shows user's appointments
  - Status filtering
  - Date sorting
  - Pagination

#### Create Appointment
- **POST** `/api/appointments`
- **Authentication**: Required
- **Features**:
  - Validates property exists and is published
  - Prevents duplicate appointments
  - Validates future dates
  - Sets default status to PENDING

#### Get Appointment
- **GET** `/api/appointments/[id]`
- **Authentication**: Required (Owner)
- Returns appointment details with property information

#### Update Appointment
- **PUT** `/api/appointments/[id]`
- **Authentication**: Required (Owner)
- **Features**:
  - Updates appointment details
  - Prevents updates to canceled appointments
  - Validates future dates

#### Cancel Appointment
- **DELETE** `/api/appointments/[id]`
- **Authentication**: Required (Owner)
- Changes status to CANCELED

### 6. Payments (`/api/payments/*`)

#### List Payments
- **GET** `/api/payments`
- **Authentication**: Required
- **Features**:
  - Role-based filtering (users see own, admins see all)
  - Status and type filtering
  - Date range filtering
  - Pagination

#### Create Payment
- **POST** `/api/payments`
- **Authentication**: Required
- **Features**:
  - Validates property exists
  - Creates payment record
  - Integrates with Stripe

#### Get Payment
- **GET** `/api/payments/[id]`
- **Authentication**: Required (Owner/ADMIN)
- Returns payment details with user and property info

#### Update Payment
- **PUT** `/api/payments/[id]`
- **Authentication**: Required (ADMIN only)
- Updates payment status and details

#### Cancel Payment
- **DELETE** `/api/payments/[id]`
- **Authentication**: Required (Owner/ADMIN)
- Changes status to CANCELED

#### Payment Statistics
- **GET** `/api/payments/stats`
- **Authentication**: Required (ADMIN/AGENT)
- Returns payment analytics:
  - Total payments and amounts
  - Success rates
  - Payment type distribution
  - Monthly revenue trends

### 7. Stripe Integration (`/api/stripe/*`)

#### Create Payment Intent
- **POST** `/api/stripe/create-payment-intent`
- **Authentication**: Required
- **Features**:
  - Creates Stripe payment intent
  - Validates property and user
  - Returns client secret for frontend
  - Creates payment record in database

#### Webhook Handler
- **POST** `/api/stripe/webhook`
- **Authentication**: Stripe signature verification
- **Features**:
  - Processes Stripe webhooks
  - Updates payment statuses
  - Handles payment success/failure
  - Manages refunds

### 8. Reviews (`/api/reviews/*`)

#### List Reviews
- **GET** `/api/reviews`
- **Query Parameters**:
  - `propertyId`: Filter by property
  - `publishedOnly`: Show only published reviews
  - Pagination and sorting

#### Create Review
- **POST** `/api/reviews`
- **Authentication**: Required
- **Features**:
  - Validates property exists
  - Prevents duplicate reviews
  - Sets default published status

#### Get Review
- **GET** `/api/reviews/[id]`
- Returns review details with user and property info

#### Update Review
- **PUT** `/api/reviews/[id]`
- **Authentication**: Required (Owner/ADMIN)
- Updates review content and published status

#### Delete Review
- **DELETE** `/api/reviews/[id]`
- **Authentication**: Required (Owner/ADMIN)
- Removes review

#### Review Statistics
- **GET** `/api/reviews/stats`
- Returns review analytics:
  - Average ratings
  - Rating distribution
  - Top rated properties
  - Recent reviews

### 9. Favorites (`/api/favorites/*`)

#### List Favorites
- **GET** `/api/favorites`
- **Authentication**: Required
- Returns user's favorite properties

#### Add to Favorites
- **POST** `/api/favorites`
- **Authentication**: Required
- **Features**:
  - Validates property exists
  - Prevents duplicate favorites
  - Creates favorite record

#### Remove from Favorites
- **DELETE** `/api/favorites/[id]`
- **Authentication**: Required (Owner)
- Removes favorite

### 10. Blog (`/api/blog/*`)

#### List Blog Posts
- **GET** `/api/blog`
- **Features**:
  - Shows published posts by default
  - Search functionality
  - Pagination and sorting
  - Admin can see all posts

#### Create Blog Post
- **POST** `/api/blog`
- **Authentication**: Required (ADMIN/AGENT)
- **Features**:
  - Validates unique slug
  - Handles image uploads
  - Sets publication status

#### Get Blog Post
- **GET** `/api/blog/[slug]`
- **Features**:
  - Returns post by slug
  - Increments view counter
  - Admin can see unpublished posts

#### Update Blog Post
- **PUT** `/api/blog/[slug]`
- **Authentication**: Required (ADMIN/AGENT)
- Updates post content and metadata

#### Delete Blog Post
- **DELETE** `/api/blog/[slug]`
- **Authentication**: Required (ADMIN/AGENT)
- Removes blog post

### 11. Alerts (`/api/alerts/*`)

#### List Alerts
- **GET** `/api/alerts`
- **Authentication**: Required
- **Features**:
  - Users see own alerts
  - Admins can see all alerts
  - Filtering by type and status

#### Create Alert
- **POST** `/api/alerts`
- **Authentication**: Required
- **Features**:
  - Creates property search alert
  - Configurable frequency (daily/weekly/monthly)
  - Multiple filter criteria

#### Update Alert
- **PUT** `/api/alerts/[id]`
- **Authentication**: Required (Owner/ADMIN)
- Updates alert criteria and settings

#### Delete Alert
- **DELETE** `/api/alerts/[id]`
- **Authentication**: Required (Owner/ADMIN)
- Removes alert

### 12. Analytics (`/api/analytics/*`)

#### Dashboard Analytics
- **GET** `/api/analytics`
- **Authentication**: Required (ADMIN/AGENT)
- **Features**:
  - Property statistics
  - User analytics
  - Financial metrics
  - Engagement data
  - Monthly trends
  - Top performing properties
  - Recent activity

#### Analytics Reports
- **GET** `/api/analytics/reports`
- **Authentication**: Required (ADMIN/AGENT)
- **Query Parameters**:
  - `type`: 'overview', 'properties', 'users', 'financial', 'performance'
  - `startDate`: Report start date
  - `endDate`: Report end date
  - `format`: 'json', 'csv', 'pdf'
- **Features**:
  - Detailed analytics reports
  - Custom date ranges
  - Multiple export formats
  - Performance metrics
  - Trend analysis

### 13. Media Management (`/api/media/*`)

#### Get Media File
- **GET** `/api/media/[id]`
- **Authentication**: Required (Owner/ADMIN)
- **Features**:
  - Secure file serving
  - Access control based on ownership
  - Support for images and documents

### 14. File Upload (`/api/upload/*`)

#### Image Upload
- **POST** `/api/upload/images`
- **Authentication**: Required (AGENT/ADMIN)
- **Features**:
  - Multiple file upload support
  - File type validation (JPEG, PNG, WebP)
  - File size limits (5MB for properties)
  - Unique filename generation
  - Directory organization by type
  - Error handling for failed uploads

#### Avatar Upload
- **POST** `/api/upload/avatar`
- **DELETE** `/api/upload/avatar`
- **Authentication**: Required (Self)
- **Features**:
  - Profile picture upload
  - File size limit (2MB)
  - Automatic old avatar cleanup
  - Image optimization

#### Blog Image Upload
- **POST** `/api/upload/blog`
- **GET** `/api/upload/blog`
- **Authentication**: Required (ADMIN only)
- **Features**:
  - Blog post image management
  - Rich text editor integration
  - File size limit (3MB)
  - Support for GIF format

### 15. Settings (`/api/settings/*`)

#### Get Settings
- **GET** `/api/settings`
- **Features**:
  - Returns all application settings
  - Hides sensitive data by default
  - Admin can request sensitive data

#### Update Settings
- **PUT** `/api/settings`
- **Authentication**: Required (ADMIN only)
- **Features**:
  - Updates global application settings
  - Validates setting values
  - Handles different data types

#### Contact Information
- **GET** `/api/settings/contact`
- Returns contact-related settings for public display

### 16. Admin Dashboard (`/api/admin/*`)

#### Dashboard Data
- **GET** `/api/admin/dashboard`
- **Authentication**: Required (ADMIN/AGENT)
- **Features**:
  - Real-time dashboard metrics
  - Quick stats overview
  - Recent activity summaries
  - Performance indicators
  - System health status

## Data Flow Examples

### 1. Property Search Flow

1. **User searches for properties**:
   ```
   GET /api/search?query=apartment&city=Paris&minPrice=200000&maxPrice=500000
   ```

2. **Backend processes search**:
   - Validates query parameters
   - Builds Prisma where clause
   - Applies filters (published only, not sold)
   - Executes database query with pagination

3. **Returns results**:
   ```json
   {
     "success": true,
     "data": [...properties],
     "pagination": {
       "page": 1,
       "limit": 12,
       "total": 45,
       "totalPages": 4,
       "hasNextPage": true,
       "hasPrevPage": false
     }
   }
   ```

### 2. Property Booking Flow

1. **User schedules appointment**:
   ```
   POST /api/appointments
   {
     "propertyId": "prop_123",
     "date": "2024-01-15",
     "time": "14:00",
     "notes": "Interested in viewing"
   }
   ```

2. **Backend validation**:
   - Checks user authentication
   - Validates property exists and is published
   - Prevents duplicate appointments
   - Validates future date

3. **Creates appointment**:
   - Stores in database with PENDING status
   - Returns appointment details

4. **Payment processing** (if required):
   ```
   POST /api/stripe/create-payment-intent
   {
     "propertyId": "prop_123",
     "amount": 500,
     "type": "RESERVATION"
   }
   ```

5. **Stripe integration**:
   - Creates payment intent
   - Returns client secret
   - Frontend handles payment UI

6. **Webhook processing**:
   - Stripe sends webhook on payment completion
   - Backend updates payment status
   - Triggers any necessary notifications

### 3. User Registration Flow

1. **User registers**:
   ```
   POST /api/auth/register
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "securepassword"
   }
   ```

2. **Backend processing**:
   - Validates input with Zod
   - Checks email uniqueness
   - Hashes password with bcrypt
   - Creates user with CLIENT role

3. **Returns user data**:
   ```json
   {
     "success": true,
     "data": {
       "id": "user_123",
       "name": "John Doe",
       "email": "john@example.com",
       "role": "CLIENT",
       "createdAt": "2024-01-01T00:00:00Z"
     }
   }
   ```

## Security Features

### Authentication & Authorization
- **Session-based authentication** with NextAuth.js
- **Role-based access control** for all endpoints
- **Password hashing** with bcrypt
- **JWT token management**

### Data Validation
- **Zod schemas** for all input validation
- **Type safety** with TypeScript
- **SQL injection prevention** with Prisma ORM

### Payment Security
- **Stripe integration** for secure payments
- **Webhook signature verification**
- **PCI compliance** through Stripe

### API Security
- **Rate limiting** (configurable)
- **CORS protection**
- **Input sanitization**
- **Error handling** without sensitive data exposure

## Performance Optimizations

### Database
- **Efficient queries** with Prisma
- **Indexed fields** for common searches
- **Pagination** for large datasets
- **Selective field loading**

### Caching
- **Response caching** for static data
- **Database query optimization**
- **Image optimization** with Next.js

### API Design
- **RESTful endpoints**
- **Consistent response format**
- **Efficient data structures**
- **Minimal payload sizes**

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": "Additional error information (optional)"
}
```

### Common Error Codes
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (server issues)

## Monitoring & Logging

### Logging
- **Request/response logging**
- **Error tracking**
- **Performance monitoring**
- **Database query logging**

### Analytics
- **User activity tracking**
- **Property view analytics**
- **Payment success rates**
- **Search pattern analysis**

## Additional Models and Relations

### Extended Database Schema

#### Favorite
```typescript
{
  id: string (CUID)
  userId: string (foreign key)
  propertyId: string (foreign key)
  createdAt: DateTime
  
  // Relations
  user: User
  property: Property
}
```

#### Alert
```typescript
{
  id: string (CUID)
  userId: string (foreign key)
  name: string
  type: PropertyType (optional)
  minPrice: Decimal (optional)
  maxPrice: Decimal (optional)
  minSurface: number (optional)
  maxSurface: number (optional)
  rooms: number (optional)
  bedrooms: number (optional)
  city: string (optional)
  zipCode: string (optional)
  isActive: boolean
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  lastSent: DateTime (optional)
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  user: User
}
```

#### Message
```typescript
{
  id: string (CUID)
  userId: string (foreign key)
  name: string
  email: string
  phone: string (optional)
  subject: string
  message: string
  status: 'PENDING' | 'READ' | 'REPLIED' | 'CLOSED'
  response: string (optional)
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  user: User
}
```

#### Settings
```typescript
{
  id: string (CUID)
  key: string (unique)
  value: string
  description: string (optional)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Advanced API Features

### File Upload System
The backend implements a comprehensive file upload system with:
- **Multi-file support**: Handle multiple files in single request
- **Type-specific validation**: Different rules for property, avatar, and blog images
- **Size limitations**: Configurable size limits per file type
- **Secure storage**: Files stored in organized directory structure
- **Error handling**: Detailed error reporting for failed uploads

### Search and Filtering
Advanced search capabilities include:
- **Full-text search**: Across multiple fields (title, description, address, city)
- **Faceted filtering**: Multiple simultaneous filters
- **Geographic search**: Location-based filtering with coordinates
- **Price range filtering**: Min/max price boundaries
- **Feature-based filtering**: Property amenities and characteristics
- **Autocomplete**: Real-time search suggestions

### Payment Processing
Integrated Stripe payment system with:
- **Payment intents**: Secure payment processing
- **Webhook handling**: Real-time payment status updates
- **Multiple payment types**: Reservations, deposits, commissions
- **Refund support**: Automated refund processing
- **Payment analytics**: Revenue tracking and reporting

### Real-time Features
- **View tracking**: Property view counters
- **Activity logging**: User action tracking
- **Notification system**: Real-time alerts and updates
- **Status updates**: Property status changes

## Deployment Considerations

### Environment Variables
- `DATABASE_URL`: MySQL connection string
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `NEXTAUTH_URL`: Application base URL
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe public key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FACEBOOK_CLIENT_ID`: Facebook OAuth client ID
- `FACEBOOK_CLIENT_SECRET`: Facebook OAuth client secret

### Database Setup
- **Prisma migrations** for schema changes
- **Seed data** for initial setup with sample properties and users
- **Backup strategy** for data protection
- **Connection pooling** for optimal performance

### Production Optimizations
- **CDN** for static assets and uploaded images
- **Database connection pooling** for concurrent requests
- **Load balancing** for high traffic scenarios
- **Redis caching** for session storage and frequent queries
- **Image optimization** with Next.js Image component
- **Monitoring and alerting** for system health

### Security Considerations
- **Rate limiting** on API endpoints
- **CORS configuration** for cross-origin requests
- **Input sanitization** for all user inputs
- **SQL injection prevention** with Prisma ORM
- **File upload security** with type and size validation
- **Authentication middleware** for protected routes

## Conclusion

This backend provides a comprehensive, secure, and scalable foundation for the Real Estate Agency application. It handles all aspects of property management, user interactions, payments, and analytics while maintaining security and performance standards.

The API is designed to work seamlessly with the frontend, providing consistent responses and proper error handling. The database schema is optimized for real estate data and supports all required features including search, filtering, payments, and user management.
