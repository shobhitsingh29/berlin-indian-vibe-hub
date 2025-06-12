import { body, validationResult } from 'express-validator';

export const validateSearch = [
    body('query').optional().trim(),
    body('category').optional().isIn(['music', 'dance', 'theater', 'workshop', 'other', 'all']),
    body('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
    body('location').optional().trim(),
    body('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    body('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    body('sort').optional().isIn(['date', 'title', 'price']).withMessage('Invalid sort field'),
    body('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc')
];

export const validateSearchResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
