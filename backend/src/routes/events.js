import express from 'express';
import Event from '../models/Event.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
import { validateSearch, validateSearchResults } from '../middleware/searchValidation.js';

// Debug route registration
console.log('Registering POST /api/events/search route');

// Search events (supports both GET and POST)
router.post('/search', validateSearch, validateSearchResults, async (req, res) => {
    console.log('POST /api/events/search endpoint hit');
    // Also support GET for backward compatibility
    if (Object.keys(req.query).length > 0) {
        req.body = { ...req.body, ...req.query };
    }
    try {
        const {
            query,
            category = 'all',
            startDate,
            endDate,
            location,
            page = 1,
            limit = 10,
            sort = 'date',
            order = 'asc'
        } = req.body || {}; // Handle empty body case

        const searchQuery = {};
        const searchOptions = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: {
                [sort]: order === 'asc' ? 1 : -1
            }
        };

        // Add search filters
        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        if (category !== 'all') {
            searchQuery.category = category;
        }

        if (startDate && endDate) {
            searchQuery.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            searchQuery.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            searchQuery.date = { $lte: new Date(endDate) };
        }

        if (location) {
            searchQuery.location = { $regex: location, $options: 'i' };
        }

        // Add pagination and sorting
        const events = await Event.find(searchQuery)
            .populate('organizer', 'name')
            .sort(searchOptions.sort)
            .skip((searchOptions.page - 1) * searchOptions.limit)
            .limit(searchOptions.limit);

        const total = await Event.countDocuments(searchQuery);
        const totalPages = Math.ceil(total / searchOptions.limit);

        res.json({
            data: events,
            meta: {
                total,
                page: searchOptions.page,
                limit: searchOptions.limit,
                totalPages
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware for event validation
const validateEvent = [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('location').trim().isLength({ min: 3 }).withMessage('Location must be at least 3 characters'),
    body('date').isISO8601().withMessage('Date must be a valid ISO date'),
    body('startTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:mm format'),
    body('endTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:mm format'),
    body('category').isIn(['music', 'dance', 'theater', 'workshop', 'other']).withMessage('Invalid category'),
    body('imageUrl').isURL().withMessage('Invalid image URL'),
    body('ticketsAvailable').isInt({ min: 0 }).withMessage('Tickets available must be a non-negative number'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
];

// Get all upcoming events
router.get('/', async (req, res) => {
    try {
        const events = await Event.getUpcomingEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get events by category
router.get('/category/:category', async (req, res) => {
    try {
        const events = await Event.getEventsByCategory(req.params.category);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name');
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Star/unstar an event
router.post('/:id/star', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Toggle the starred status
        event.isStarred = !event.isStarred;
        await event.save();

        res.json({ success: true, isStarred: event.isStarred });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new event (requires authentication)
router.post('/', auth, validateEvent, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const event = new Event({
            ...req.body,
            organizer: req.user._id
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update event (requires authentication and ownership)
router.put('/:id', auth, validateEvent, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if user owns the event
        if (event.organizer.toString() !== req.user._id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        Object.assign(event, req.body);
        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete event (requires authentication and ownership)
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if user owns the event
        if (event.organizer.toString() !== req.user._id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
