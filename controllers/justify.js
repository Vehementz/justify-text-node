const toobusy = require('toobusy-js');
const jwt = require('jsonwebtoken');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { justifyText } = require('../utils/justifyText');
const dailyWordCount = {};


const JWT_SECRET = "YOUR_SECRET_KEY";
const RATE_LIMIT = 80000;

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

const processAndJustifyText = (inputText) => {
    try {
        let text = DOMPurify.sanitize(inputText.toString());
        if (!text) {
            throw new Error('Texte requis');
        }

        const justifiedText = justifyText(text);
        return justifiedText.replace(/\n/g, '<br>');
    } catch (error) {
        console.error("Error during text justification:", error.message);
        throw error;
    }
};
exports.authorizeUser = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) return res.status(401).json({ error: 'Token is required' });

    // Define the 'token' variable before using it
    const token = bearerHeader.split(' ')[1]; // Split at the space to get the token

    if (!token) return res.status(401).json({ error: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        req.email = decoded.email;
        console.log('Authorization successful. Proceeding to the next handler.');
        // if (typeof req.body.text === "string") {
        //     console.log("yes it's STRING")
        // }
        if (!req.body || typeof req.body.text !== 'string') {
            return res.status(400).send('Invalid input.');
        }
        next();
    });
};


exports.postJustify = (req, res) => {

    // Check server load
    if (toobusy()) {
        return res.status(503).send("I'm busy right now, sorry, wait 1 minute.");
    }

    // Check if text is provided
    if (!req.body.text || typeof req.body.text !== 'string') {
        return res.status(400).send('Text data is missing or invalid.');
    }

    // Calculate word count
    const wordCount = req.body.text.split(' ').length;

    // Update daily word count
    if (dailyWordCount[req.email]) {
        dailyWordCount[req.email] += wordCount;
    } else {
        dailyWordCount[req.email] = wordCount;
    }

    // Check if rate limit exceeded
    if (dailyWordCount[req.email] > RATE_LIMIT) {
        return res.status(402).send('Payment Required');
    }

    // Process and justify text
    
    const responseText = `<p style="text-align: justify; width: 600px;">${processAndJustifyText(req.body.text)}</p>`;


    // Send response
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.send(responseText);
};


exports.getJustify = (req, res) => {
    if (toobusy()) {
        return res.status(503).send("I'm busy right now, sorry, wait 1 minute.");
    }

    try {
        const responseText = `<p style="text-align: justify;">${processAndJustifyText(req.query.text)}</p>`;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.send(responseText);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
