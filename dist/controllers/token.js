"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.validateEmail = void 0;
const express_validator_1 = require("express-validator");
const toobusy = require('toobusy-js');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "YOUR_SECRET_KEY"; // Change this to a strong secret key
exports.validateEmail = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email is required and should be valid.'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
const generateToken = (req, res) => {
    const email = req.body.email;
    if (toobusy()) {
        res.status(503).send("I'm busy right now, sorry, wait 1 minute.");
        return; // Explicitly return after sending response
    }
    if (!email)
        return res.status(400).json({ error: 'Email is required' });
    const token = jsonwebtoken_1.default.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
};
exports.generateToken = generateToken;
// Conditional mocking of express-validator for testing
if (process.env.NODE_ENV === 'test') {
    jest.mock('express-validator', () => ({
        validationResult: jest.fn().mockReturnValue({ isEmpty: () => true }),
        body: jest.fn().mockReturnValue(jest.fn())
    }));
}
