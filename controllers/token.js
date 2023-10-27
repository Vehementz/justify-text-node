const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');


const JWT_SECRET = "YOUR_SECRET_KEY";  // Change this to a strong secret key


exports.validateEmail = [
    body('email').isEmail().withMessage('Email is required and should be valid.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
exports.generateToken = (req, res) => {
    const email = req.body.email;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
};

// expect(res.json).toHaveBeenCalledWith({ error: 'Email is required' });


