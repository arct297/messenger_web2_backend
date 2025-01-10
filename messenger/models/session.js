const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    }, {
        collection: 'sessions',
        timestamps: true
    }
);

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session
