import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['music', 'dance', 'theater', 'workshop', 'other']
    },
    imageUrl: {
        type: String,
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketsAvailable: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    isStarred: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        required: true,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update updatedAt timestamp before saving
eventSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = async function() {
    return this.find({ status: 'upcoming', date: { $gte: new Date() } })
        .sort({ date: 1 })
        .populate('organizer', 'name');
};

// Static method to get events by category
eventSchema.statics.getEventsByCategory = async function(category) {
    return this.find({ category, status: 'upcoming' })
        .sort({ date: 1 })
        .populate('organizer', 'name');
};

export default mongoose.model('Event', eventSchema);
