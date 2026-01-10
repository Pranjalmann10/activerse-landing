# Activerse - Arcade & Entertainment Landing Page with Booking System

A modern, interactive landing page for an arcade and entertainment location with a full-featured booking system connected to MongoDB.

## Features

- 🎮 Modern, responsive landing page with animations
- 📅 Complete booking system with database integration
- 💳 **Stripe Payment Gateway Integration** - Bookings only confirmed after successful payment
- 🔐 Admin authentication with login/password protection
- 🎯 Admin dashboard to manage bookings
- ⏰ Time slot availability management
- 📊 Booking statistics and filtering
- 🎨 Beautiful UI with arcade-themed design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd activerse-landing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `MONGODB_URI` - Your MongoDB connection string (from MongoDB Atlas)
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (from https://dashboard.stripe.com/apikeys)
   - `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
   - `SESSION_SECRET` - A random secret string for sessions (generate with `openssl rand -base64 32`)
   - `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` - Admin credentials (CHANGE from defaults!)
   - `EMAIL_USER`, `EMAIL_PASSWORD` - Email configuration for contact form (use Gmail App Password)
   - `CONTACT_EMAIL` - Email where contact form messages will be sent

4. **Configure Stripe Publishable Key in frontend:**
   
   Edit `script.js` and replace the placeholder on line 121:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE';
   ```

5. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Landing Page: http://localhost:3000
   - Login Page: http://localhost:3000/login.html
   - API Endpoints: http://localhost:3000/api
   - Bookings Admin: http://localhost:3000/bookings.html

## How to Use

### Making a Booking

1. Click the "Book Now" button on the landing page
2. Fill in the booking form with your details
3. Select date, time, and number of guests
4. **Payment will be calculated automatically** as ₹1,000 per person (e.g., 3 guests = ₹3,000)
5. Enter your payment details using the secure Stripe payment form
6. Complete the payment
7. Booking will only be confirmed after **successful payment**
8. You'll receive a confirmation with your booking ID and payment receipt

### Managing Bookings

1. Navigate to `http://localhost:3000/bookings.html`
2. Log in with your admin credentials (set in `.env` file)
3. View all bookings with filtering options
4. Update booking status (Confirm/Cancel)
5. Delete bookings if needed
6. View booking statistics

## API Endpoints

### Booking Endpoints
- `GET /api/bookings` - Get all bookings (requires auth, supports `?status=pending&date=2024-01-15` filters)
- `GET /api/bookings/:id` - Get single booking (requires auth)
- `POST /api/bookings` - Create new booking (requires payment_intent_id)
- `PUT /api/bookings/:id` - Update booking (requires auth)
- `DELETE /api/bookings/:id` - Delete booking (requires auth)
- `GET /api/availability/:date` - Get availability for a date
- `GET /api/stats` - Get booking statistics (requires auth)

### Payment Endpoints
- `POST /api/payment/create-intent` - Create Stripe payment intent
- `POST /api/webhook/stripe` - Stripe webhook for payment confirmations

### Authentication Endpoints
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password (requires auth)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

## Database

The system uses MongoDB (via Mongoose) for data storage. Set up your MongoDB Atlas connection string in the `.env` file.

### Collections

- **bookings**: Stores all booking information (includes payment_status, payment_intent_id, amount_paid)
- **time_slots**: Manages available time slots and capacity
- **users**: Admin user accounts for authentication
- **password_reset_tokens**: Password reset tokens for forgot password functionality

## Technology Stack

- Frontend: HTML5, CSS3, JavaScript (Vanilla), Stripe.js
- Backend: Node.js, Express.js
- Database: MongoDB (via Mongoose)
- Payment: Stripe Payment Gateway
- Authentication: bcrypt, express-session
- Email: Nodemailer
- Styling: Custom CSS with modern animations

## Project Structure

```
activerse-landing/
├── index.html              # Main landing page
├── bookings.html           # Admin bookings page
├── login.html              # Admin login page
├── forgot-password.html    # Password reset request page
├── reset-password.html     # Password reset page
├── styles.css              # All styles
├── script.js               # Frontend JavaScript
├── server.js               # Backend server
├── models/                 # MongoDB models
│   ├── Booking.js
│   ├── User.js
│   ├── TimeSlot.js
│   └── PasswordResetToken.js
├── package.json            # Dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Customization

- Adjust time slots in `index.html` (booking-time select options)
- Change available spots per time slot in `server.js` (default: 24 guests per slot)
- Customize colors in `styles.css` (CSS variables)
- Update pricing in `calculateBookingPrice()` function in `server.js` (default: ₹1,000 per person per 1-hour slot)

## Payment Gateway Setup

### Pricing Structure

The system uses a fixed pricing structure:
- **₹1,000 per person per 1-hour slot**
- Price is calculated as: Number of Guests × ₹1,000
- All bookings are for 1-hour time slots

### Testing Payments

For testing with Stripe (INR currency), use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date, any CVC, and any PIN code

**Note:** Stripe supports INR (Indian Rupees) as a currency. Make sure your Stripe account is configured for INR payments.

### Production Setup

1. Replace test keys with live keys from Stripe Dashboard
2. Update `STRIPE_PUBLISHABLE_KEY` in `script.js` with your live publishable key
3. Set up webhook endpoint in Stripe Dashboard pointing to: `https://yourdomain.com/api/webhook/stripe`
4. Update `STRIPE_WEBHOOK_SECRET` in `.env` file
5. Enable HTTPS for secure payment processing and session cookies
6. Set `cookie.secure = true` in session configuration (line 37 in `server.js`)
7. Use strong, randomly generated `SESSION_SECRET` (e.g., `openssl rand -base64 32`)

## Security Notes

- **NEVER commit `.env` file to version control** - it contains sensitive credentials
- Always use environment variables for sensitive data (API keys, passwords, etc.)
- Change default admin password immediately after setup (set `ADMIN_PASSWORD` in `.env`)
- Use strong `SESSION_SECRET` in production (generate with: `openssl rand -base64 32`)
- Enable HTTPS in production for secure session cookies and payment processing
- For Gmail email, use App Passwords instead of your regular password

## Notes

- The database is managed by MongoDB Atlas (connection string in `.env`)
- Make sure port 3000 is available, or change it in `.env` file
- The booking system validates dates to ensure bookings are only for future dates
- Time slots are automatically managed with capacity limits (max 24 guests per slot)
- **Bookings are only confirmed after successful payment**
- Admin credentials are set via environment variables (see `.env.example`)
