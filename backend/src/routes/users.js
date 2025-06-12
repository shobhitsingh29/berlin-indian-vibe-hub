import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware for profile validation
const validateProfile = [
    body('preferences').isArray().optional(),
    body('bio').isString().optional(),
    body('location').isString().optional(),
    body('avatar').isURL().optional()
];

// Middleware for user validation
const validateUser = [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Register new user
router.post('/register', validateUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        // Generate JWT token
        const token = await user.generateAuthToken();
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user's profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update current user's profile
router.put('/profile', [auth, validateProfile], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['preferences', 'bio', 'location', 'avatar'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's starred events
router.get('/profile/starred-events', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('starredEvents');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.starredEvents);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Star/unstar an event
router.put('/profile/starred-events/:eventId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const eventId = req.params.eventId;
        const eventIndex = user.starredEvents.indexOf(eventId);

        if (eventIndex === -1) {
            user.starredEvents.push(eventId);
        } else {
            user.starredEvents.splice(eventIndex, 1);
        }

        await user.save();
        res.json(user.starredEvents);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login user
router.post('/login', validateUser, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = await user.generateAuthToken();
        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user's profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
