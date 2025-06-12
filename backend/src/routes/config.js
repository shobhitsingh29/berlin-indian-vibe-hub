import express from 'express';
import Configuration from '../models/Configuration.js';
import auth from '../middleware/auth.js';
import { Config, CONFIG_KEYS } from '../models/Config';

const router = express.Router();

// Get configuration (public endpoint)
router.get('/config', async (req, res) => {
    try {
        const config = await Configuration.findOne();
        if (!config) {
            await Configuration.ensureSingle();
            return res.json(await Configuration.findOne());
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
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
