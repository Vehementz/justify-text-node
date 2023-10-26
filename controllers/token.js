const jwt = require('jsonwebtoken');


const JWT_SECRET = "YOUR_SECRET_KEY";  // Change this to a strong secret key

exports.generateToken = (req, res) => {
    const email = req.body.email;
    
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });  // Token expires in 24 hours
    res.json({ token });
};
