import mongoose from 'mongoose';

const CONFIG_KEYS = {
    EVENT_CATEGORIES: 'event_categories',
    USER_ROLES: 'user_roles',
    DATE_FORMATS: 'date_formats',
    ERROR_MESSAGES: 'error_messages',
    SEARCH_FILTERS: 'search_filters'
};

const configSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create indexes for faster lookups
configSchema.index({ key: 1 });

const Config = mongoose.model('Config', configSchema);

// Export helper functions
export const config = {
    Config,
    CONFIG_KEYS,
    async getAllConfigs() {
        return await Config.find({});
    },
    async getConfig(key) {
        return await Config.findOne({ key });
    },
    async upsertConfig(key, value, description = '') {
        return await Config.findOneAndUpdate(
            { key },
            { 
                value,
                description,
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );
    }
};

export default config;
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create indexes for faster lookups
configSchema.index({ key: 1 });

const Config = mongoose.model('Config', configSchema);

// Export helper functions
module.exports = {
    Config,
    // Configuration keys
    CONFIG_KEYS: {
        EVENT_CATEGORIES: 'event_categories',
        USER_ROLES: 'user_roles',
        DATE_FORMATS: 'date_formats',
        ERROR_MESSAGES: 'error_messages',
        SEARCH_FILTERS: 'search_filters'
    },

    // Get all configurations
    async getAllConfigs() {
        return await Config.find({});
    },

    // Get specific configuration by key
    async getConfig(key) {
        return await Config.findOne({ key });
    },

    // Update or create configuration
    async upsertConfig(key, value, description = '') {
        return await Config.findOneAndUpdate(
            { key },
            { 
                value,
                description,
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );
    }
};
