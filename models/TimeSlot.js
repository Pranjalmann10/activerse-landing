const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    available_spots: {
        type: Number,
        default: 24
    },
    booked_spots: {
        type: Number,
        default: 0
    }
});

// Compound index to ensure unique date/time combination
timeSlotSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
