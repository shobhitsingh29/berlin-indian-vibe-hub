import mongoose from 'mongoose';
import { Config, configKeys as CONFIG_KEYS } from '../models/Config.js';

const configData = {
    [CONFIG_KEYS.EVENT_CATEGORIES]: [
        'music',
        'dance',
        'theater',
        'workshop',
        'festival',
        'food',
        'spiritual',
        'other'
    ],
    [CONFIG_KEYS.USER_ROLES]: [
        'user',
        'event_creator',
        'admin'
    ],
    [CONFIG_KEYS.DATE_FORMATS]: {
        default: 'dd MMM yyyy HH:mm',
        full: 'EEEE, dd MMM yyyy HH:mm',
        short: 'dd MMM HH:mm'
    },
    [CONFIG_KEYS.ERROR_MESSAGES]: {
        validation: {
            required: 'This field is required',
            email: 'Please enter a valid email',
            password: 'Password must be at least 6 characters',
            date: 'Please enter a valid date'
        },
        auth: {
            unauthorized: 'Unauthorized access',
            forbidden: 'You do not have permission to perform this action',
            token_expired: 'Your session has expired. Please login again'
        },
        server: {
            error: 'An error occurred. Please try again later'
        }
    },
    [CONFIG_KEYS.SEARCH_FILTERS]: {
        fields: [
            'title',
            'description',
            'location',
            'category',
            'date'
        ],
        sortOptions: [
            'date',
            'title',
            'price'
        ]
    }
};

async function initConfig() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Clear existing configs
        await Config.deleteMany({});

        // Create new configs
        for (const [key, value] of Object.entries(configData)) {
            await Config.create({
                key,
                value,
                description: `Configuration for ${key.replace('_', ' ')}`
            });
        }

        console.log('Configuration initialization completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing configuration:', error);
        process.exit(1);
    }
}

initConfig();
