import express from 'express';
import Configuration from '../models/Configuration.js';
import auth from '../middleware/auth.js';
import { Config, CONFIG_KEYS } from '../models/Config.js';

const router = express.Router();

// Get configuration (public endpoint)
router.get('/config', async (req, res) => {
    try {
        console.log('Fetching configuration...');
        let config = await Configuration.findOne();
        
        if (!config) {
            console.log('No config found, creating default configuration...');
            await Configuration.ensureSingle();
            config = await Configuration.findOne();
            console.log('Default configuration created:', config);
        }
        
        if (!config) {
            console.error('Failed to create default configuration');
            return res.status(500).json({ error: 'Failed to initialize configuration' });
        }
        
        console.log('Sending configuration:', config);
        res.json(config);
    } catch (error) {
        console.error('Error in /config endpoint:', error);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Update configuration (requires admin auth)
router.put('/', auth, async (req, res) => {
    try {
        const config = await Configuration.findOne();
        if (!config) {
            return res.status(404).json({ error: 'Configuration not found' });
        }

        // Only allow updating specific fields
        const allowedUpdates = ['eventCategories', 'eventStatuses', 'timeFormat',
            'dateFormat', 'minPrice', 'maxPrice', 'currencySymbol', 'maxTickets',
            'minTickets', 'defaultLocation', 'imageUploadSizeLimit',
            'allowedImageTypes', 'minDescriptionLength', 'maxDescriptionLength',
            'minTitleLength', 'maxTitleLength', 'apiBaseUrl'];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        Object.assign(config, updates);
        await config.save();
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
