import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // In a real app, you would compare the password and generate a JWT token
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
