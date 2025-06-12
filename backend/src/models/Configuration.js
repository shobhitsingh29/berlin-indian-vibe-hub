import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
    // Event Categories
    eventCategories: {
        type: [String],
        default: ['music', 'dance', 'theater', 'workshop', 'other']
    },

    // Event Statuses
    eventStatuses: {
        type: [String],
        default: ['upcoming', 'ongoing', 'completed', 'cancelled']
    },

    // Time Format
    timeFormat: {
        type: String,
        default: 'HH:mm'
    },

    // Date Format
    dateFormat: {
        type: String,
        default: 'yyyy-MM-dd'
    },

    // Price Settings
    minPrice: {
        type: Number,
        default: 0
    },

    maxPrice: {
        type: Number,
        default: 1000
    },

    currencySymbol: {
        type: String,
        default: '€'
    },

    // Ticket Settings
    maxTickets: {
        type: Number,
        default: 1000
    },

    minTickets: {
        type: Number,
        default: 0
    },

    // Location Settings
    defaultLocation: {
        type: String,
        default: 'Berlin'
    },

    // Image Settings
    imageUploadSizeLimit: {
        type: Number,
        default: 5242880 // 5MB in bytes
    },

    allowedImageTypes: {
        type: [String],
        default: ['image/jpeg', 'image/png', 'image/webp']
    },

    // Validation Rules
    minDescriptionLength: {
        type: Number,
        default: 10
    },

    maxDescriptionLength: {
        type: Number,
        default: 1000
    },

    minTitleLength: {
        type: Number,
        default: 3
    },

    maxTitleLength: {
        type: Number,
        default: 100
    },

    // API Settings
    apiBaseUrl: {
        type: String,
        default: process.env.API_URL || 'http://localhost:3001/api'
    },

    // Version
    version: {
        type: String,
        default: '1.0.0'
    },

    // Last Updated
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensure only one configuration exists
configSchema.statics.ensureSingle = async function() {
    const count = await this.countDocuments();
    if (count === 0) {
        await this.create({});
    }
};

export default mongoose.model('Configuration', configSchema);
