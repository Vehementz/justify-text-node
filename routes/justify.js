const express = require('express');
const router = express.Router();
var toobusy = require('toobusy-js');
const { justifyText } = require('../utils/justifText');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
// const sanitizeUrl = require('@braintree/sanitize-url');
const sanitizeUrl = require('@braintree/sanitize-url').sanitizeUrl;

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

// router.use(express.text({ type: 'text/plain' })); 
router.use(express.text({ type: 'text/plain', limit: '50kb' })); // for example, a limit of 10kb


router.get('/api/justify', (req, res, next) => {
    if (toobusy()) {
        res.send(503, "I'm busy right now, sorry, wait 1 minute.");
    } else {
        next();
    }

    // Set maximum lag to an aggressive value.
    toobusy.maxLag(10);

    // Set check interval to a faster value. This will catch more latency spikes
    // but may cause the check to be too sensitive.
    toobusy.interval(250);

    // Get current maxLag or interval setting by calling without parameters.
    var currentMaxLag = toobusy.maxLag(), interval = toobusy.interval();

    toobusy.onLag(function (currentLag) {
        console.log("Event loop lag detected! Latency: " + currentLag + "ms");
    });

    let text = req.query.text;
    text = sanitizeUrl(text); // sanitize the text if it's a URL
    text = DOMPurify.sanitize(text); // Further sanitize with DOMPurify

    if (!text) {
        return res.status(400).json({ error: 'Texte requis' });
    }

    const justifiedText = justifyText(text);
    const responseText = `<p style="text-align: justify; width: 600px;">${justifiedText}</p>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-XSS-Protection', '1; mode=block');

    res.send(responseText);
});





router.post('/api/justify', (req, res) => {
    let text = req.body;
    text = sanitizeUrl(text); // sanitize the text if it's a URL
    text = DOMPurify.sanitize(text); // Further sanitize with DOMPurify

    if (!text) {
        return res.status(400).json({ error: 'Texte requis' });
    }

    const justifiedText = justifyText(text);
    console.log('Justified text:', justifiedText);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    res.send(`<p style="text-align: justify; width: 600px;">${justifiedText}</p>`);
});

module.exports = router;
