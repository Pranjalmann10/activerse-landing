const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Payment integration removed - bookings are saved directly to database

// MongoDB Models
const Booking = require('./models/Booking');
const User = require('./models/User');
const PasswordResetToken = require('./models/PasswordResetToken');
const TimeSlot = require('./models/TimeSlot');

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
    secret: process.env.SESSION_SECRET || 'activerse-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction, // true in production (HTTPS), false in development
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: isProduction ? 'lax' : 'lax' // 'lax' works for same-origin requests on Vercel
    }
}));

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
// Works in both local development and Vercel serverless environment
const publicDir = process.env.VERCEL 
    ? path.join(process.cwd(), 'public')
    : path.join(__dirname, 'public');

// Verify public directory exists and log contents (for debugging)
if (fs.existsSync(publicDir)) {
    try {
        const publicFiles = fs.readdirSync(publicDir);
        console.log('✓ Public directory found:', publicDir);
        console.log('✓ Public directory files:', publicFiles.join(', '));
    } catch (err) {
        console.error('Error reading public directory:', err.message);
    }
} else {
    console.warn('⚠ Public directory not found at:', publicDir);
}

// Serve static files from public directory
// Files in public/ will be accessible at root level (e.g., /styles.css, /script.js)
// This works for both local development and Vercel serverless
app.use(express.static(publicDir, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // Set appropriate Content-Type headers
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        
        // Set cache headers for static assets
        if (filePath.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|mp4|webm)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
}));

// Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/activerse';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✓ Connected to MongoDB Atlas');
    
    // Create or update admin user after connection
    initializeAdminUser();
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    if (!MONGODB_URI || MONGODB_URI.includes('username:password')) {
        console.error('⚠ Please set MONGODB_URI in your .env file with your MongoDB Atlas connection string');
    }
});

// Initialize admin user
async function initializeAdminUser() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-password';
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        
        if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'change-this-password') {
            console.warn('⚠ WARNING: Using default admin password. Please set ADMIN_PASSWORD in .env file for security.');
        }
        
        const existingUser = await User.findOne({ 
            $or: [{ email: adminEmail }, { username: adminUsername }] 
        });
        
        const hash = await bcrypt.hash(adminPassword, 10);
        
        if (existingUser) {
            // Update existing admin user
            await User.updateOne(
                { _id: existingUser._id },
                { $set: { username: adminUsername, email: adminEmail, password_hash: hash } }
            );
            console.log(`✓ Admin user updated: username=${adminUsername}, email=${adminEmail}`);
        } else {
            // Create new admin user
            await User.create({
                username: adminUsername,
                email: adminEmail,
                password_hash: hash
            });
            console.log(`✓ Admin user created: username=${adminUsername}, email=${adminEmail}`);
        }
    } catch (error) {
        console.error('Error initializing admin user:', error);
    }
}

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(401).json({ error: 'Authentication required' });
};

// API Routes - Authentication

// Check authentication status
app.get('/api/auth/check', async (req, res) => {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('username email');
            if (!user) {
                return res.status(401).json({ authenticated: false });
            }
            res.json({ authenticated: true, user });
        } catch (error) {
            res.status(401).json({ authenticated: false });
        }
    } else {
        res.json({ authenticated: false });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ 
            $or: [{ username }, { email: username }] 
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user._id.toString();
        req.session.username = user.username;
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Change password (requires authentication)
app.post('/api/auth/change-password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(500).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(currentPassword, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ _id: req.session.userId }, { $set: { password_hash: hash } });
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Request password reset (forgot password)
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        let token = null;
        
        // Always return success for security (don't reveal if email exists)
        if (user) {
            token = uuidv4();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour

            // Delete old tokens for this user
            await PasswordResetToken.deleteMany({ user_id: user._id });
            
            // Create new token
            await PasswordResetToken.create({
                user_id: user._id,
                token,
                expires_at: expiresAt
            });
        }
        
        res.json({ 
            message: 'If an account with that email exists, a password reset link has been sent.',
            resetToken: token // Remove this in production
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reset password with token
app.post('/api/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const tokenRow = await PasswordResetToken.findOne({
            token,
            expires_at: { $gt: new Date() },
            used: false
        });

        if (!tokenRow) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ _id: tokenRow.user_id }, { $set: { password_hash: hash } });
        await PasswordResetToken.updateOne({ _id: tokenRow._id }, { $set: { used: true } });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all bookings (for admin view) - PROTECTED
app.get('/api/bookings', requireAuth, async (req, res) => {
    try {
        const { status, date } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }
        if (date) {
            query.booking_date = date;
        }

        const bookings = await Booking.find(query).sort({ created_at: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single booking by ID - PROTECTED
app.get('/api/bookings/:id', requireAuth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Calculate booking price: 1500 INR per person per 1-hour slot
function calculateBookingPrice(numberOfGuests) {
    const PRICE_PER_PERSON = 1500; // 1500 INR per person
    return PRICE_PER_PERSON * numberOfGuests;
}

// Create new booking (without payment - direct save to database)
app.post('/api/bookings', async (req, res) => {
    const { name, email, phone, booking_date, booking_time, number_of_guests, special_requests } = req.body;

    // Validation
    if (!name || !email || !phone || !booking_date || !booking_time || !number_of_guests || number_of_guests < 1) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if date/time is valid (future date)
        const bookingDateTime = new Date(`${booking_date}T${booking_time}`);
        const now = new Date();
        if (bookingDateTime <= now) {
            return res.status(400).json({ error: 'Booking date and time must be in the future' });
        }

        // Check availability - count total guests from all confirmed bookings for this time slot
        let slot = await TimeSlot.findOne({ date: booking_date, time: booking_time });

        // Calculate total guests already booked for this time slot
        const existingBookings = await Booking.find({
            booking_date,
            booking_time,
            status: { $in: ['confirmed', 'pending'] }
        });
        const totalGuestsBooked = existingBookings.reduce((sum, booking) => sum + booking.number_of_guests, 0);

        // Check if adding new guests would exceed the limit of 24
        if (totalGuestsBooked + number_of_guests > 24) {
            const remainingSpots = 24 - totalGuestsBooked;
            if (remainingSpots <= 0) {
                return res.status(400).json({ error: 'This time slot is fully booked. Maximum 24 persons per slot.' });
            } else {
                return res.status(400).json({ error: `Only ${remainingSpots} spot(s) remaining in this time slot. Please reduce the number of guests.` });
            }
        }

        // Initialize slot if doesn't exist
        if (!slot) {
            slot = await TimeSlot.create({
                date: booking_date,
                time: booking_time,
                available_spots: 24,
                booked_spots: 0
            });
        }

        // Calculate price for reference (not charged)
        const PRICE_PER_PERSON = 1500;
        const totalAmount = PRICE_PER_PERSON * number_of_guests;

        // Create booking without payment
        const booking = await Booking.create({
            name,
            email,
            phone,
            booking_date,
            booking_time,
            number_of_guests,
            special_requests: special_requests || '',
            status: 'pending', // Status is pending since no payment
            payment_status: 'not_required',
            amount_paid: 0,
            currency: 'inr'
        });

        // Update time slot booked spots (count of guests, not bookings)
        await TimeSlot.updateOne(
            { _id: slot._id },
            { $inc: { booked_spots: number_of_guests } }
        );

        res.status(201).json({
            id: booking._id,
            message: 'Booking request submitted successfully! We will contact you soon to confirm.',
            booking: {
                id: booking._id,
                name,
                email,
                phone,
                booking_date,
                booking_time,
                number_of_guests,
                special_requests,
                status: 'pending',
                estimated_amount: totalAmount
            }
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ 
            error: 'Failed to create booking',
            details: error.message || 'Unknown error occurred'
        });
    }
});

// Update booking status - PROTECTED
app.put('/api/bookings/:id', requireAuth, async (req, res) => {
    try {
        const { status, booking_date, booking_time, number_of_guests } = req.body;
        const updateFields = { updated_at: new Date() };

        // Get existing booking to check current values
        const existingBooking = await Booking.findById(req.params.id);
        if (!existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // If changing time slot or number of guests, check availability
        const newBookingDate = booking_date || existingBooking.booking_date;
        const newBookingTime = booking_time || existingBooking.booking_time;
        const newNumberOfGuests = number_of_guests || existingBooking.number_of_guests;

        // Handle status changes (confirmed to cancelled, or cancelled to confirmed)
        if (status && status !== existingBooking.status) {
            if (status === 'cancelled' && existingBooking.status === 'confirmed') {
                // Free up spots when cancelling a confirmed booking
                await TimeSlot.updateOne(
                    { date: existingBooking.booking_date, time: existingBooking.booking_time },
                    { $inc: { booked_spots: -existingBooking.number_of_guests } }
                );
            } else if (status === 'confirmed' && existingBooking.status !== 'confirmed') {
                // Check availability when confirming a booking
                const existingBookings = await Booking.find({
                    booking_date: existingBooking.booking_date,
                    booking_time: existingBooking.booking_time,
                    status: 'confirmed',
                    _id: { $ne: req.params.id }
                });
                const totalGuestsBooked = existingBookings.reduce((sum, booking) => sum + booking.number_of_guests, 0);
                
                if (totalGuestsBooked + existingBooking.number_of_guests > 24) {
                    return res.status(400).json({ error: 'Cannot confirm booking. This time slot is fully booked. Maximum 24 persons per slot.' });
                }
                
                // Increment spots when confirming
                await TimeSlot.updateOne(
                    { date: existingBooking.booking_date, time: existingBooking.booking_time },
                    { $inc: { booked_spots: existingBooking.number_of_guests } }
                );
            }
        }

        // Only check availability if time slot or guest count is changing
        if ((booking_date || booking_time || number_of_guests) && existingBooking.status === 'confirmed') {
            // Calculate total guests for the new/current time slot (excluding current booking)
            const existingBookings = await Booking.find({
                booking_date: newBookingDate,
                booking_time: newBookingTime,
                status: 'confirmed',
                _id: { $ne: req.params.id } // Exclude current booking
            });
            const totalGuestsBooked = existingBookings.reduce((sum, booking) => sum + booking.number_of_guests, 0);

            // Check if new guest count would exceed 24
            if (totalGuestsBooked + newNumberOfGuests > 24) {
                const remainingSpots = 24 - totalGuestsBooked;
                if (remainingSpots <= 0) {
                    return res.status(400).json({ error: 'This time slot is fully booked. Maximum 24 persons per slot.' });
                } else {
                    return res.status(400).json({ error: `Only ${remainingSpots} spot(s) remaining in this time slot. Please reduce the number of guests.` });
                }
            }

            // Update time slot counts if changing time slot or guest count
            if (booking_date || booking_time) {
                // Decrement old time slot
                await TimeSlot.updateOne(
                    { date: existingBooking.booking_date, time: existingBooking.booking_time },
                    { $inc: { booked_spots: -existingBooking.number_of_guests } }
                );
                // Increment new time slot
                await TimeSlot.updateOne(
                    { date: newBookingDate, time: newBookingTime },
                    { $inc: { booked_spots: newNumberOfGuests } }
                );
            } else if (number_of_guests && number_of_guests !== existingBooking.number_of_guests) {
                // Adjust time slot count for guest count change
                const guestDifference = number_of_guests - existingBooking.number_of_guests;
                await TimeSlot.updateOne(
                    { date: newBookingDate, time: newBookingTime },
                    { $inc: { booked_spots: guestDifference } }
                );
            }
        }

        if (status) updateFields.status = status;
        if (booking_date) updateFields.booking_date = booking_date;
        if (booking_time) updateFields.booking_time = booking_time;
        if (number_of_guests) updateFields.number_of_guests = number_of_guests;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        res.json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete booking - PROTECTED
app.delete('/api/bookings/:id', requireAuth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Delete booking
        await Booking.deleteOne({ _id: req.params.id });

        // Update time slot availability (subtract the number of guests, not just 1)
        await TimeSlot.updateOne(
            { date: booking.booking_date, time: booking.booking_time },
            { $inc: { booked_spots: -booking.number_of_guests } }
        );

        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get available time slots for a date
app.get('/api/availability/:date', async (req, res) => {
    try {
        const slots = await TimeSlot.find({ date: req.params.date });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get booking statistics - PROTECTED
app.get('/api/stats', requireAuth, async (req, res) => {
    try {
        const total_bookings = await Booking.countDocuments();
        const pending = await Booking.countDocuments({ status: 'pending' });
        const confirmed = await Booking.countDocuments({ status: 'confirmed' });
        const cancelled = await Booking.countDocuments({ status: 'cancelled' });

        res.json({
            total_bookings,
            pending,
            confirmed,
            cancelled
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        // Configure nodemailer transporter
        // For Gmail, you need to use an App Password or enable "Less secure app access"
        // Get App Password from: https://myaccount.google.com/apppasswords
        const emailUser = process.env.EMAIL_USER;
        const emailPassword = process.env.EMAIL_PASSWORD;
        const contactEmail = process.env.CONTACT_EMAIL || emailUser;
        
        if (!emailUser || !emailPassword) {
            console.error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
            return res.status(500).json({ 
                error: 'Contact form is not configured. Please contact the administrator directly.' 
            });
        }
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPassword
            }
        });

        // Email content
        const mailOptions = {
            from: emailUser,
            to: contactEmail,
            subject: `New Contact Form Message from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
            replyTo: email
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ 
            message: 'Your message has been sent successfully! We will get back to you soon.' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send message. Please try again later or contact us directly.' 
        });
    }
});

// Payment webhook removed - no payment processing needed

// Static files (CSS, JS) are now handled by Express static middleware above
// No explicit routes needed - Express will serve files from public/ directory

// Serve HTML files
app.get('/', (req, res) => {
    const htmlPath = process.env.VERCEL 
        ? path.join(process.cwd(), 'index.html')
        : path.join(__dirname, 'index.html');
    res.sendFile(htmlPath);
});

app.get('/login', (req, res) => {
    const htmlPath = process.env.VERCEL 
        ? path.join(process.cwd(), 'login.html')
        : path.join(__dirname, 'login.html');
    res.sendFile(htmlPath);
});

app.get('/forgot-password', (req, res) => {
    const htmlPath = process.env.VERCEL 
        ? path.join(process.cwd(), 'forgot-password.html')
        : path.join(__dirname, 'forgot-password.html');
    res.sendFile(htmlPath);
});

app.get('/reset-password', (req, res) => {
    const htmlPath = process.env.VERCEL 
        ? path.join(process.cwd(), 'reset-password.html')
        : path.join(__dirname, 'reset-password.html');
    res.sendFile(htmlPath);
});

app.get('/bookings', (req, res) => {
    const htmlPath = process.env.VERCEL 
        ? path.join(process.cwd(), 'bookings.html')
        : path.join(__dirname, 'bookings.html');
    res.sendFile(htmlPath);
});

 // Start server (only if not on Vercel)
 if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Activerse booking server running on http://localhost:${PORT}`);
        console.log(`API endpoints available at http://localhost:${PORT}/api/`);
    });

    // Graceful shutdown (only for local server)
    process.on('SIGINT', async () => {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
            process.exit(0);
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    });
}

// Export app for Vercel serverless functions
module.exports = app;
