const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expires_at: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
