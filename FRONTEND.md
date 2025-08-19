# Real Estate Agency Frontend Documentation

## Overview

This document provides a comprehensive overview of all frontend pages implemented in the Real Estate Agency application, organized by user roles and explaining the utility and features of each page.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: NextAuth.js client-side
- **State Management**: React hooks and context
- **Notifications**: React Hot Toast
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## User Roles

The application supports three distinct user roles with different access levels:

### 1. **CLIENT** (Regular User)
- Browse and search properties
- View property details
- Manage favorites
- Schedule appointments
- Write reviews
- Make payments
- Manage personal profile
- Create property alerts

### 2. **AGENT** (Real Estate Agent)
- All CLIENT permissions
- Create and manage properties
- View appointment requests
- Access basic analytics
- Upload property images
- Manage property listings

### 3. **ADMIN** (Administrator)
- All AGENT permissions
- Manage all users
- Access full analytics
- Manage system settings
- Moderate reviews
- Manage blog content
- View notifications

## Public Pages (Accessible to All Users)

### 1. **Homepage** (`/`)
- **File**: `src/app/(main)/page.tsx`
- **Purpose**: Landing page showcasing the agency
- **Features**:
  - Hero section with search functionality
  - Featured properties carousel
  - Company statistics display
  - Service offerings overview
  - Client testimonials
  - Call-to-action sections
- **Components**: Property cards, stats counters, testimonial slider

### 2. **Properties Listing** (`/properties`)
- **File**: `src/app/(main)/properties/page.tsx`
- **Purpose**: Browse all available properties
- **Features**:
  - Grid/list view toggle
  - Advanced filtering (price, type, location, features)
  - Search functionality
  - Sorting options (price, date, popularity)
  - Pagination
  - Property cards with key information
- **Filters**: Price range, property type, location, rooms, surface area

### 3. **Property Details** (`/properties/[id]`)
- **File**: `src/app/(main)/properties/[id]/page.tsx`
- **Purpose**: Detailed view of a specific property
- **Features**:
  - Image gallery with lightbox
  - Comprehensive property information
  - Interactive map with location
  - Features and amenities list
  - Contact agent form
  - Schedule appointment button
  - Add to favorites functionality
  - Related properties suggestions
  - Reviews and ratings section
  - Virtual tour integration (if available)

### 4. **Property Search** (`/search`)
- **File**: `src/app/search/page.tsx`
- **Purpose**: Advanced property search with filters
- **Features**:
  - Multi-criteria search form
  - Real-time results
  - Map view integration
  - Save search functionality
  - Search history
  - Filter presets

### 5. **Services** (`/services`)
- **File**: `src/app/services/page.tsx`
- **Purpose**: Showcase agency services
- **Features**:
  - Service categories (buying, selling, renting, management)
  - Detailed service descriptions
  - Pricing information
  - Process explanations
  - Contact forms for each service
  - Success stories and testimonials

### 6. **Property Estimation** (`/estimation`)
- **File**: `src/app/estimation/page.tsx`
- **Purpose**: Free property valuation service
- **Features**:
  - Multi-step estimation form
  - Property type selection
  - Location details
  - Property characteristics input
  - Automated price estimation
  - Request professional evaluation
  - Contact information collection

### 7. **About Us** (`/about`)
- **File**: `src/app/(main)/about/page.tsx`
- **Purpose**: Company information and team presentation
- **Features**:
  - Company history and mission
  - Team member profiles
  - Agency statistics
  - Certifications and awards
  - Office locations
  - Contact information

### 8. **Contact** (`/contact`)
- **File**: `src/app/(main)/contact/page.tsx`
- **Purpose**: Contact forms and information
- **Features**:
  - General contact form
  - Office locations with maps
  - Phone and email contacts
  - Business hours
  - FAQ section
  - Social media links

### 9. **Blog** (`/blog`)
- **File**: `src/app/blog/page.tsx`
- **Purpose**: Real estate news and articles
- **Features**:
  - Article listing with pagination
  - Category filtering
  - Search functionality
  - Featured articles
  - Author information
  - Publication dates

### 10. **Blog Article** (`/blog/[slug]`)
- **File**: `src/app/blog/[slug]/page.tsx`
- **Purpose**: Individual blog post view
- **Features**:
  - Full article content
  - Author bio
  - Related articles
  - Social sharing buttons
  - Comments section (if enabled)
  - Reading time estimation

### 11. **Privacy Policy** (`/privacy`)
- **File**: `src/app/privacy/page.tsx`
- **Purpose**: Privacy policy and data protection information
- **Features**:
  - GDPR compliance information
  - Data collection practices
  - Cookie policy
  - User rights explanation

## Authentication Pages

### 12. **Sign In** (`/auth/signin`)
- **File**: `src/app/auth/signin/page.tsx`
- **Purpose**: User login
- **Features**:
  - Email/password login form
  - Social media login (Google, Facebook)
  - Remember me functionality
  - Password visibility toggle
  - Forgot password link
  - Registration redirect
  - Role-based redirection after login

### 13. **Sign Up** (`/auth/signup`)
- **File**: `src/app/auth/signup/page.tsx`
- **Purpose**: New user registration
- **Features**:
  - Registration form with validation
  - Email verification
  - Password strength indicator
  - Terms and conditions acceptance
  - Social media registration
  - Automatic login after registration

## User Dashboard Pages (CLIENT Role)

### 14. **User Profile** (`/profile`)
- **File**: `src/app/profile/page.tsx`
- **Purpose**: Personal profile management
- **Features**:
  - Profile information editing
  - Avatar upload
  - Password change
  - Account settings
  - Activity history
  - Property alerts management
  - Notification preferences

### 15. **Favorites** (`/favorites`)
- **File**: `src/app/favorites/page.tsx`
- **Purpose**: Manage saved properties
- **Features**:
  - Favorite properties list
  - Remove from favorites
  - Quick property details
  - Direct contact options
  - Share favorites list
  - Export functionality

## Admin Dashboard Pages (ADMIN/AGENT Roles)

### 16. **Admin Dashboard** (`/admin`)
- **File**: `src/app/admin/page.tsx`
- **Purpose**: Main administrative dashboard
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Key performance indicators (KPIs)
  - Recent activity feed
  - Quick action buttons
  - Property statistics
  - User activity metrics
  - Revenue charts
  - Notification alerts
  - System status overview

### 17. **Properties Management** (`/admin/properties`)
- **File**: `src/app/admin/properties/page.tsx`
- **Purpose**: Manage all properties
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Properties table with filtering
  - Status management (published/draft/sold)
  - Bulk operations
  - Search and sort functionality
  - Quick edit options
  - View statistics
  - Export property data

### 18. **Add New Property** (`/admin/properties/new`)
- **File**: `src/app/admin/properties/new/page.tsx`
- **Purpose**: Create new property listings
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Multi-step property creation form
  - Image upload with preview
  - GPS coordinates input
  - Feature selection
  - Publication options
  - Draft saving capability
  - Form validation
  - Progress indicator

### 19. **User Management** (`/admin/users`)
- **File**: `src/app/admin/users/page.tsx`
- **Purpose**: Manage all users
- **Access**: ADMIN only
- **Features**:
  - User list with role filtering
  - User creation and editing
  - Role assignment
  - Account status management
  - User activity tracking
  - Bulk operations
  - Search and pagination

### 20. **Payments Management** (`/admin/payments`)
- **File**: `src/app/admin/payments/page.tsx`
- **Purpose**: Monitor and manage payments
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Payment transaction list
  - Status filtering
  - Payment details view
  - Refund processing
  - Revenue analytics
  - Export functionality
  - Payment method statistics

### 21. **Messages** (`/admin/messages`)
- **File**: `src/app/admin/messages/page.tsx`
- **Purpose**: Handle customer inquiries
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Message inbox with filtering
  - Message status management
  - Response functionality
  - Message templates
  - Auto-responder settings
  - Message search
  - Archive functionality

### 22. **Appointments** (`/admin/appointments`)
- **File**: `src/app/admin/appointments/page.tsx`
- **Purpose**: Manage property viewing appointments
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Appointment calendar view
  - Status management (pending/confirmed/completed)
  - Appointment details editing
  - Client contact information
  - Scheduling conflicts detection
  - Email notifications
  - Appointment history

### 23. **Blog Management** (`/admin/blog`)
- **File**: `src/app/admin/blog/page.tsx`
- **Purpose**: Manage blog content
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Article list with status filtering
  - Create/edit articles
  - Rich text editor
  - Image management
  - SEO optimization
  - Publication scheduling
  - Category management

### 24. **Analytics** (`/admin/analytics`)
- **File**: `src/app/admin/analytics/page.tsx`
- **Purpose**: Comprehensive analytics dashboard
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Property performance metrics
  - User engagement analytics
  - Revenue tracking
  - Conversion rates
  - Geographic analytics
  - Time-based reports
  - Exportable charts
  - Custom date ranges

### 25. **Admin Profile** (`/admin/profile`)
- **File**: `src/app/admin/profile/page.tsx`
- **Purpose**: Admin user profile management
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Professional profile editing
  - Contact information management
  - Avatar upload
  - Password change
  - Account settings
  - Activity log
  - Notification preferences

### 26. **System Settings** (`/admin/settings`)
- **File**: `src/app/admin/settings/page.tsx`
- **Purpose**: Application configuration
- **Access**: ADMIN only
- **Features**:
  - General settings configuration
  - Contact information management
  - Email settings
  - Payment gateway configuration
  - SEO settings
  - Social media links
  - System maintenance options

### 27. **Notifications** (`/admin/notifications`)
- **File**: `src/app/admin/notifications/page.tsx`
- **Purpose**: System notifications management
- **Access**: ADMIN and AGENT roles
- **Features**:
  - Notification center
  - Alert management
  - Notification history
  - Read/unread status
  - Notification settings
  - Auto-notification rules

## Layout Components

### 28. **Main Layout** (`src/app/layout.tsx`)
- **Purpose**: Root layout for all pages
- **Features**:
  - Global styles and fonts
  - Session provider wrapper
  - Toast notification container
  - Meta tags and SEO
  - Global error handling

### 29. **Admin Layout** (`src/app/admin/layout.tsx`)
- **Purpose**: Administrative interface layout
- **Features**:
  - Admin navigation sidebar
  - User menu with logout
  - Breadcrumb navigation
  - Mobile responsive design
  - Role-based menu items
  - Quick search functionality

## Key Features Across Pages

### Authentication & Authorization
- **Session Management**: Automatic login state detection
- **Role-Based Access**: Different UI elements based on user role
- **Protected Routes**: Automatic redirection for unauthorized access
- **Login Persistence**: Remember user sessions across browser sessions

### User Experience
- **Responsive Design**: Mobile-first approach with breakpoints
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Form Validation**: Real-time validation with helpful messages

### Performance Optimizations
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic page-based code splitting
- **Caching**: Client-side caching for API responses
- **SEO Optimization**: Meta tags, structured data, and sitemap

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus handling

## Data Flow Patterns

### Property Browsing Flow
1. User visits homepage or properties page
2. Applies filters and search criteria
3. Views property list with pagination
4. Clicks on property for detailed view
5. Can add to favorites or schedule appointment

### User Registration Flow
1. User clicks sign up
2. Fills registration form
3. Email verification (if enabled)
4. Automatic login and profile setup
5. Redirected to appropriate dashboard

### Property Management Flow (Admin/Agent)
1. Agent logs into admin dashboard
2. Navigates to properties section
3. Creates new property with multi-step form
4. Uploads images and sets details
5. Publishes or saves as draft
6. Monitors performance in analytics

### Appointment Booking Flow
1. User views property details
2. Clicks schedule appointment
3. Selects preferred date/time
4. Fills contact information
5. Submits request
6. Agent receives notification and confirms

## Mobile Responsiveness

All pages are designed with mobile-first approach:
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Collapsible mobile menus
- **Forms**: Touch-friendly input elements
- **Images**: Responsive image galleries
- **Tables**: Horizontal scrolling on mobile

## SEO and Performance

### SEO Features
- **Dynamic Meta Tags**: Page-specific titles and descriptions
- **Open Graph Tags**: Social media sharing optimization
- **Structured Data**: JSON-LD for search engines
- **Sitemap Generation**: Automatic sitemap creation
- **Robots.txt**: Search engine crawling directives

### Performance Features
- **Server-Side Rendering**: Fast initial page loads
- **Static Generation**: Pre-built pages where possible
- **Image Optimization**: WebP format and lazy loading
- **Bundle Optimization**: Tree shaking and code splitting
- **Caching Strategies**: Browser and CDN caching

## Conclusion

The frontend provides a comprehensive, user-friendly interface for all stakeholders in the real estate process. From property browsing for clients to comprehensive management tools for agents and administrators, each page is designed with specific user needs in mind while maintaining consistency and performance across the entire application.

The role-based access system ensures users see only relevant features, while the responsive design guarantees a great experience across all devices. The integration with the backend API provides real-time data updates and secure transaction processing.
