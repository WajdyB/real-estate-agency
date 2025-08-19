# FUNCTIONALITIES.md - Real Estate Agency Testing Guide

## Overview

This document provides comprehensive testing scenarios for all roles in the Real Estate Agency application. The application supports three user roles: **CLIENT**, **AGENT**, and **ADMIN**, each with different permissions and access levels.

## User Roles & Permissions

### CLIENT (Regular User)
- View published properties
- Create favorites
- Schedule appointments
- Write reviews
- Make payments
- Manage profile
- Create property alerts
- Send messages

### AGENT (Real Estate Agent)
- All CLIENT permissions
- Create and manage properties
- View appointment requests
- Access basic analytics
- Manage property listings
- View messages from clients

### ADMIN (Administrator)
- All AGENT permissions
- Manage all users
- Access full analytics
- Manage system settings
- Moderate reviews
- Manage blog content
- View all messages
- Manage payments

---

## Testing Scenarios

### 1. CLIENT Role Testing

#### 1.1 Authentication & Registration
**Endpoint**: `POST /api/auth/register`
**Test Steps**:
1. Navigate to `/auth/signup`
2. Fill registration form with valid data:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "securepassword123"
   }
   ```
3. Submit form
4. Verify user is created with CLIENT role
5. Verify email verification (if enabled)

**Endpoint**: `POST /api/auth/[...nextauth]`
**Test Steps**:
1. Navigate to `/auth/signin`
2. Enter valid credentials
3. Verify successful login
4. Verify session creation
5. Verify redirect to dashboard

#### 1.2 Property Browsing
**Endpoint**: `GET /api/properties`
**Test Steps**:
1. Navigate to `/properties`
2. Test pagination (page, limit parameters)
3. Test search functionality:
   - Search by title: `?search=apartment`
   - Search by city: `?city=Tunis`
4. Test filters:
   - Property type: `?type=APARTMENT`
   - Price range: `?minPrice=100000&maxPrice=500000`
   - Surface area: `?minSurface=50`
   - Rooms: `?rooms=3`
5. Test sorting: `?sortBy=price&sortOrder=asc`
6. Test featured properties: `?featured=true`
7. Verify only published properties are shown

**Endpoint**: `GET /api/properties/[id]`
**Test Steps**:
1. Click on a property from the list
2. Verify property details are displayed
3. Verify view counter increments
4. Test with invalid property ID (should return 404)

#### 1.3 Search Functionality
**Endpoint**: `GET /api/search`
**Test Steps**:
1. Navigate to `/search`
2. Test full-text search across title, description, address
3. Test advanced filters combination
4. Test location-based search
5. Test price and surface range filtering

**Endpoint**: `GET /api/search/autocomplete`
**Test Steps**:
1. Type in search box
2. Verify suggestions appear for:
   - Cities
   - Properties
   - Addresses
3. Test with different query types

#### 1.4 Favorites Management
**Endpoint**: `POST /api/favorites/[id]`
**Test Steps**:
1. Navigate to a property page
2. Click "Add to Favorites"
3. Verify property is added to favorites
4. Test adding same property again (should handle duplicate)

**Endpoint**: `GET /api/favorites`
**Test Steps**:
1. Navigate to `/favorites`
2. Verify all favorited properties are displayed
3. Test pagination

**Endpoint**: `DELETE /api/favorites/[id]`
**Test Steps**:
1. Go to favorites page
2. Click "Remove from Favorites"
3. Verify property is removed
4. Test with invalid favorite ID

#### 1.5 Appointments
**Endpoint**: `POST /api/appointments`
**Test Steps**:
1. Navigate to a property page
2. Click "Schedule Visit"
3. Fill appointment form:
   ```json
   {
     "propertyId": "property_id",
     "date": "2024-02-15",
     "time": "14:00",
     "notes": "Interested in viewing"
   }
   ```
4. Submit form
5. Verify appointment is created with PENDING status

**Endpoint**: `GET /api/appointments`
**Test Steps**:
1. Navigate to profile/appointments
2. Verify user's appointments are displayed
3. Test status filtering
4. Test pagination

**Endpoint**: `PUT /api/appointments/[id]`
**Test Steps**:
1. Edit an existing appointment
2. Update date, time, or notes
3. Verify changes are saved

**Endpoint**: `DELETE /api/appointments/[id]`
**Test Steps**:
1. Cancel an appointment
2. Verify status changes to CANCELED

#### 1.6 Reviews
**Endpoint**: `POST /api/reviews`
**Test Steps**:
1. Navigate to a property page
2. Click "Write Review"
3. Fill review form:
   ```json
   {
     "propertyId": "property_id",
     "rating": 5,
     "comment": "Great property!"
   }
   ```
4. Submit review
5. Verify review is created (initially unpublished)

**Endpoint**: `GET /api/reviews`
**Test Steps**:
1. View property reviews
2. Verify only published reviews are shown
3. Test pagination

#### 1.7 Payments
**Endpoint**: `POST /api/payments`
**Test Steps**:
1. Navigate to payment page
2. Fill payment form:
   ```json
   {
     "propertyId": "property_id",
     "amount": 500,
     "type": "RESERVATION",
     "description": "Property reservation"
   }
   ```
3. Submit payment
4. Verify payment record is created

**Endpoint**: `GET /api/payments`
**Test Steps**:
1. Navigate to profile/payments
2. Verify user's payments are displayed
3. Test status filtering



#### 1.9 Profile Management
**Endpoint**: `GET /api/users/profile`
**Test Steps**:
1. Navigate to `/profile`
2. Verify user information is displayed
3. Test profile editing

**Endpoint**: `PUT /api/users/profile`
**Test Steps**:
1. Update profile information:
   ```json
   {
     "name": "Updated Name",
     "email": "updated@email.com",
     "phone": "+21612345678"
   }
   ```
2. Submit changes
3. Verify profile is updated

**Endpoint**: `POST /api/upload/avatar`
**Test Steps**:
1. Upload profile picture
2. Verify image is uploaded
3. Verify avatar is updated

#### 1.10 Messages
**Endpoint**: `POST /api/messages`
**Test Steps**:
1. Navigate to contact page
2. Send message:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "subject": "Property Inquiry",
     "message": "I'm interested in this property"
   }
   ```
3. Verify message is sent

---

### 2. AGENT Role Testing

#### 2.1 Property Management
**Endpoint**: `POST /api/properties`
**Test Steps**:
1. Navigate to `/admin/properties/new`
2. Fill property form with all required fields:
   ```json
   {
     "title": "Beautiful Apartment",
     "description": "Modern apartment in city center",
     "price": 250000,
     "type": "APARTMENT",
     "surface": 80,
     "rooms": 3,
     "bedrooms": 2,
     "bathrooms": 1,
     "address": "123 Main St",
     "city": "Tunis",
     "zipCode": "1000"
   }
   ```
3. Upload property images
4. Submit form
5. Verify property is created as draft

**Endpoint**: `PUT /api/properties/[id]`
**Test Steps**:
1. Edit existing property
2. Update property information
3. Change publication status
4. Verify changes are saved

**Endpoint**: `DELETE /api/properties/[id]`
**Test Steps**:
1. Delete a property
2. Verify property is removed
3. Test with properties owned by other users (should fail)

#### 2.2 Property Analytics
**Endpoint**: `GET /api/properties/stats`
**Test Steps**:
1. Navigate to `/admin/analytics`
2. Verify property statistics are displayed:
   - Total properties
   - Published vs draft
   - Views statistics
   - Type distribution

#### 2.3 Appointment Management
**Endpoint**: `GET /api/appointments`
**Test Steps**:
1. Navigate to `/admin/appointments`
2. Verify all appointments for agent's properties are shown
3. Test appointment status management
4. Test filtering and search

**Endpoint**: `PUT /api/appointments/[id]`
**Test Steps**:
1. Update appointment status (CONFIRM/CANCEL)
2. Add notes to appointments
3. Verify changes are saved

#### 2.4 Message Management
**Endpoint**: `GET /api/messages`
**Test Steps**:
1. Navigate to `/admin/messages`
2. Verify messages are displayed
3. Test message status management
4. Test search and filtering

**Endpoint**: `PUT /api/messages/[id]`
**Test Steps**:
1. Mark messages as read
2. Reply to messages
3. Close messages
4. Verify status changes

---

### 3. ADMIN Role Testing

#### 3.1 User Management
**Endpoint**: `GET /api/users`
**Test Steps**:
1. Navigate to `/admin/users`
2. Verify all users are displayed
3. Test search functionality:
   - Search by name: `?search=John`
   - Search by email: `?search=john@example.com`
4. Test role filtering: `?role=CLIENT`
5. Test pagination
6. Test sorting

**Endpoint**: `POST /api/users`
**Test Steps**:
1. Create new user:
   ```json
   {
     "name": "New Agent",
     "email": "agent@example.com",
     "password": "securepassword",
     "role": "AGENT",
     "phone": "+21612345678"
   }
   ```
2. Verify user is created
3. Test with duplicate email (should fail)
4. Test with invalid role (should fail)

**Endpoint**: `PUT /api/users/[id]`
**Test Steps**:
1. Update user information
2. Change user role
3. Update user status
4. Verify changes are saved

**Endpoint**: `DELETE /api/users/[id]`
**Test Steps**:
1. Delete a user
2. Verify user is removed
3. Test self-deletion (should fail)
4. Verify cascade deletion of user data

#### 3.2 Dashboard Analytics
**Endpoint**: `GET /api/admin/dashboard`
**Test Steps**:
1. Navigate to `/admin`
2. Verify dashboard statistics:
   - Properties overview
   - Users overview
   - Payments overview
   - Messages overview
3. Verify recent activity feed
4. Test quick action buttons

#### 3.3 Advanced Analytics
**Endpoint**: `GET /api/analytics/reports`
**Test Steps**:
1. Navigate to `/admin/analytics`
2. Test different report types:
   - Properties report: `?type=properties`
   - Users report: `?type=users`
   - Financial report: `?type=financial`
   - Performance report: `?type=performance`
3. Test date range filtering
4. Test report export

#### 3.4 Blog Management
**Endpoint**: `POST /api/blog`
**Test Steps**:
1. Navigate to `/admin/blog`
2. Create new blog post:
   ```json
   {
     "title": "Real Estate Market Trends",
     "excerpt": "Analysis of current market trends",
     "content": "Full blog post content...",
     "image": "image_url"
   }
   ```
3. Submit post
4. Verify post is created as draft

**Endpoint**: `PUT /api/blog/[slug]`
**Test Steps**:
1. Edit existing blog post
2. Update content and metadata
3. Change publication status
4. Verify changes are saved

**Endpoint**: `DELETE /api/blog/[slug]`
**Test Steps**:
1. Delete blog post
2. Verify post is removed

#### 3.5 Settings Management
**Endpoint**: `GET /api/settings`
**Test Steps**:
1. Navigate to `/admin/settings`
2. Verify system settings are displayed
3. Test settings update

**Endpoint**: `PUT /api/settings`
**Test Steps**:
1. Update system settings
2. Verify changes are saved
3. Test with invalid settings (should fail)

#### 3.6 Payment Management
**Endpoint**: `GET /api/payments`
**Test Steps**:
1. Navigate to `/admin/payments`
2. Verify all payments are displayed
3. Test payment status management
4. Test filtering by status, type, date range

**Endpoint**: `PUT /api/payments/[id]`
**Test Steps**:
1. Update payment status
2. Process refunds
3. Add payment notes
4. Verify changes are saved

#### 3.7 Review Moderation
**Endpoint**: `GET /api/reviews`
**Test Steps**:
1. Navigate to `/admin/reviews`
2. Verify all reviews are displayed
3. Test review approval/rejection
4. Test review editing

**Endpoint**: `PUT /api/reviews/[id]`
**Test Steps**:
1. Approve or reject reviews
2. Edit review content
3. Change publication status
4. Verify changes are saved

---

## API Endpoint Testing Checklist

### Authentication Endpoints
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/[...nextauth]` - User login
- [ ] `GET /api/auth/signout` - User logout

### Property Endpoints
- [ ] `GET /api/properties` - List properties
- [ ] `POST /api/properties` - Create property (AGENT/ADMIN)
- [ ] `GET /api/properties/[id]` - Get property details
- [ ] `PUT /api/properties/[id]` - Update property (Owner/ADMIN)
- [ ] `DELETE /api/properties/[id]` - Delete property (Owner/ADMIN)
- [ ] `GET /api/properties/stats` - Property statistics (AGENT/ADMIN)
- [ ] `GET /api/properties/featured` - Featured properties

### Search Endpoints
- [ ] `GET /api/search` - Advanced search
- [ ] `GET /api/search/autocomplete` - Search suggestions
- [ ] `GET /api/search/filters` - Available filters

### User Endpoints
- [ ] `GET /api/users` - List users (ADMIN)
- [ ] `POST /api/users` - Create user (ADMIN)
- [ ] `GET /api/users/[id]` - Get user details (Self/ADMIN)
- [ ] `PUT /api/users/[id]` - Update user (Self/ADMIN)
- [ ] `DELETE /api/users/[id]` - Delete user (ADMIN)
- [ ] `GET /api/users/profile` - Get own profile
- [ ] `PUT /api/users/profile` - Update own profile
- [ ] `GET /api/users/stats` - User statistics (ADMIN)

### Appointment Endpoints
- [ ] `GET /api/appointments` - List appointments
- [ ] `POST /api/appointments` - Create appointment
- [ ] `GET /api/appointments/[id]` - Get appointment details
- [ ] `PUT /api/appointments/[id]` - Update appointment
- [ ] `DELETE /api/appointments/[id]` - Cancel appointment

### Payment Endpoints
- [ ] `GET /api/payments` - List payments
- [ ] `POST /api/payments` - Create payment
- [ ] `GET /api/payments/[id]` - Get payment details
- [ ] `PUT /api/payments/[id]` - Update payment
- [ ] `GET /api/payments/stats` - Payment statistics (ADMIN)

### Review Endpoints
- [ ] `GET /api/reviews` - List reviews
- [ ] `POST /api/reviews` - Create review
- [ ] `GET /api/reviews/[id]` - Get review details
- [ ] `PUT /api/reviews/[id]` - Update review
- [ ] `DELETE /api/reviews/[id]` - Delete review
- [ ] `GET /api/reviews/stats` - Review statistics (ADMIN)

### Favorite Endpoints
- [ ] `GET /api/favorites` - List favorites
- [ ] `POST /api/favorites/[id]` - Add to favorites
- [ ] `DELETE /api/favorites/[id]` - Remove from favorites



### Message Endpoints
- [ ] `GET /api/messages` - List messages (AGENT/ADMIN)
- [ ] `POST /api/messages` - Send message
- [ ] `GET /api/messages/[id]` - Get message details
- [ ] `PUT /api/messages/[id]` - Update message status

### Blog Endpoints
- [ ] `GET /api/blog` - List blog posts
- [ ] `POST /api/blog` - Create blog post (ADMIN)
- [ ] `GET /api/blog/[slug]` - Get blog post
- [ ] `PUT /api/blog/[slug]` - Update blog post (ADMIN)
- [ ] `DELETE /api/blog/[slug]` - Delete blog post (ADMIN)

### Admin Endpoints
- [ ] `GET /api/admin/dashboard` - Dashboard data (AGENT/ADMIN)
- [ ] `GET /api/analytics/reports` - Analytics reports (AGENT/ADMIN)

### Upload Endpoints
- [ ] `POST /api/upload/avatar` - Upload avatar
- [ ] `POST /api/upload/images` - Upload property images
- [ ] `POST /api/upload/blog` - Upload blog images

### Stripe Endpoints
- [ ] `POST /api/stripe/create-payment-intent` - Create payment intent
- [ ] `POST /api/stripe/webhook` - Stripe webhook

---

## Security Testing

### Authentication Testing
- [ ] Test unauthenticated access to protected endpoints
- [ ] Test expired session handling
- [ ] Test invalid credentials
- [ ] Test password strength validation
- [ ] Test email uniqueness validation

### Authorization Testing
- [ ] Test CLIENT access to AGENT-only endpoints
- [ ] Test AGENT access to ADMIN-only endpoints
- [ ] Test cross-user data access prevention
- [ ] Test property ownership validation
- [ ] Test self-deletion prevention

### Input Validation Testing
- [ ] Test SQL injection prevention
- [ ] Test XSS prevention
- [ ] Test file upload validation
- [ ] Test input sanitization
- [ ] Test rate limiting

### Payment Security Testing
- [ ] Test Stripe webhook signature verification
- [ ] Test payment amount validation
- [ ] Test duplicate payment prevention
- [ ] Test refund security

---

## Performance Testing

### Load Testing
- [ ] Test property listing with large datasets
- [ ] Test search functionality under load
- [ ] Test image upload performance
- [ ] Test concurrent user access

### Database Testing
- [ ] Test query optimization
- [ ] Test index usage
- [ ] Test connection pooling
- [ ] Test transaction handling

---

## Browser Testing

### Cross-Browser Compatibility
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge

### Mobile Responsiveness
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Test responsive design
- [ ] Test touch interactions

---

## Error Handling Testing

### API Error Responses
- [ ] Test 400 Bad Request responses
- [ ] Test 401 Unauthorized responses
- [ ] Test 403 Forbidden responses
- [ ] Test 404 Not Found responses
- [ ] Test 500 Internal Server Error responses

### User Experience
- [ ] Test error message clarity
- [ ] Test loading states
- [ ] Test form validation feedback
- [ ] Test success confirmations

---

## Data Integrity Testing

### Database Consistency
- [ ] Test foreign key constraints
- [ ] Test unique constraints
- [ ] Test cascade deletions
- [ ] Test data validation rules

### File Management
- [ ] Test image upload and storage
- [ ] Test file deletion
- [ ] Test file access permissions
- [ ] Test storage cleanup

---

## Notes for Testing

1. **Environment Setup**: Ensure you have a clean test database
2. **Test Data**: Create test users for each role before testing
3. **API Testing**: Use tools like Postman or curl for API testing
4. **Frontend Testing**: Test both UI interactions and API calls
5. **Edge Cases**: Test boundary conditions and error scenarios
6. **Documentation**: Document any bugs or issues found during testing

This comprehensive testing guide ensures thorough validation of all application functionalities across all user roles.
