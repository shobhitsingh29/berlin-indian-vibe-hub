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
        default: ''
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

// Create indexes for faster lookups
configSchema.index({ key: 1 });

// Add a pre-save hook to update the updatedAt field
configSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Add static methods to the schema
configSchema.statics = {
    // Get all configurations
    async getAllConfigs() {
        return this.find({});
    },
    
    // Get specific configuration by key
    async getConfig(key) {
        return this.findOne({ key });
    },
    
    // Update or create configuration
    async upsertConfig(key, value, description = '') {
        const filter = { key };
        const update = { 
            value,
            description,
            updatedAt: new Date() 
        };
        const options = { 
            new: true, 
            upsert: true, 
            setDefaultsOnInsert: true 
        };
        
        return this.findOneAndUpdate(filter, update, options);
    }
};

const Config = mongoose.model('Config', configSchema);

export { Config, CONFIG_KEYS };
