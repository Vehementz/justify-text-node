const express = require('express');
const router = express.Router();
const toobusy = require('toobusy-js');
const { justifyText } = require('../utils/justifText');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const jwt = require('jsonwebtoken');
const dailyWordCount = {}; 

const JWT_SECRET = "YOUR_SECRET_KEY"; // Change this to a strong secret key
const RATE_LIMIT = 80000;

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

router.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Token is required' });
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        
        req.email = decoded.email;
        next();
    });
});

// toobusy-js configuration
toobusy.maxLag(10);
toobusy.interval(250);

toobusy.onLag(function (currentLag) {
    console.log("Event loop lag detected! Latency: " + currentLag + "ms");
});

const processAndJustifyText = (inputText) => {
    let text = DOMPurify.sanitize(inputText.toString());
    if (!text) {
        throw new Error('Texte requis');
    }

    const justifiedText = justifyText(text);
    return justifiedText.replace(/\n/g, '<br>');
};


router.post('/api/justify', (req, res) => {


    if (toobusy()) {
        return res.status(503).send("I'm busy right now, sorry, wait 1 minute.");
    }

    const wordCount = req.body.split(' ').length;
    
    if (dailyWordCount[req.email]) {
        dailyWordCount[req.email] += wordCount;
    } else {
        dailyWordCount[req.email] = wordCount;
    }

    if (dailyWordCount[req.email] > RATE_LIMIT) {
        return res.status(402).send('Payment Required');
    }

    const responseText = `<p style="text-align: justify; width: 600px;">${processAndJustifyText(req.body)}</p>`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.send(responseText);
});

router.get('/api/justify', (req, res) => {
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
});

module.exports = router;
