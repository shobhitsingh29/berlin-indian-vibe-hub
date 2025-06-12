import express from 'express';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validatePost = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Post content must be between 1 and 2000 characters'),
    body('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array of strings'),
    body('images.*')
        .isString()
        .withMessage('Each image must be a string URL')
];

// Create a new post
router.post('/', [auth, ...validatePost], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { content, images = [] } = req.body;
        
        const post = new Post({
            userId: req.user._id,
            content,
            images
        });

        await post.save();
        
        // Populate user data for the response
        await post.populate('userId', 'name');
        
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all posts with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Post.countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name')
            .populate('likedBy', 'name')
            .lean();

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Like/unlike a post
router.post('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const userId = req.user._id;
        const likeIndex = post.likedBy.indexOf(userId);
        
        if (likeIndex === -1) {
            // Like the post
            post.likedBy.push(userId);
        } else {
            // Unlike the post
            post.likedBy.splice(likeIndex, 1);
        }
        
        // The pre-save hook will update the likes count
        await post.save();
        
        res.json({ 
            likes: post.likes,
            isLiked: post.likedBy.includes(userId)
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a comment to a post
router.post('/:id/comments', [auth, body('content').trim().isLength({ min: 1, max: 1000 })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = {
            userId: req.user._id,
            content: req.body.content
        };

        post.comments.push(comment);
        await post.save();
        
        // Populate user data for the response
        await post.populate('comments.userId', 'name');
        
        res.status(201).json(post.comments[post.comments.length - 1]);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a post (only by the owner)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        // Check if the user is the owner of the post
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }
        
        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
