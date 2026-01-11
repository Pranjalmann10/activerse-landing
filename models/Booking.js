const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    booking_date: {
        type: String,
        required: true
    },
    booking_time: {
        type: String,
        required: true
    },
    number_of_guests: {
        type: Number,
        required: true
    },
    special_requests: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'cancelled']
    },
    payment_status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'paid', 'failed', 'not_required']
    },
    payment_intent_id: {
        type: String
    },
    amount_paid: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'inr'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Update updated_at before saving
bookingSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
