const express = require('express');
const router = express.Router();
const toobusy = require('toobusy-js');
const { justifyText } = require('../utils/justifText');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

router.use(express.text({ type: 'text/plain', limit: '50kb' }));

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

    try {
        const responseText = `<p style="text-align: justify;">${processAndJustifyText(req.body)}</p>`;
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.send(responseText);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.get('/api/justify', (req, res) => {
    if (toobusy()) {
        return res.status(503).send("I'm busy right now, sorry, wait 1 minute.");
    }

    try {
        const responseText = `<p style="text-align: justify;">${processAndJustifyText(req.query.text)}</p>`;
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.send(responseText);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
