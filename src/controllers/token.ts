import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';


import jwt from 'jsonwebtoken';

const JWT_SECRET = "YOUR_SECRET_KEY";  // Change this to a strong secret key

export const validateEmail = [
    body('email').isEmail().withMessage('Email is required and should be valid.'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const generateToken = (req: Request, res: Response) => {
    const email = req.body.email;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
};


jest.mock('express-validator', () => ({
    validationResult: jest.fn().mockReturnValue({ isEmpty: () => true }),
    body: jest.fn().mockReturnValue(jest.fn())
}));
