const express = require('express');
const router = express.Router();
const { justifyText } = require('../utils/justifText');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

router.use(express.text({ type: 'text/plain' })); 

router.get('/api/justify', (req, res) => {
    const text = DOMPurify.sanitize(req.query.text);

    if (!text) {
        return res.status(400).json({ error: 'Texte requis' });
    }

    const justifiedText = justifyText(text);
    const responseText = `<p style="text-align: justify; width: 600px;">${justifiedText}</p>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    res.send(responseText);
});

router.post('/api/justify', (req, res) => {
    const text = DOMPurify.sanitize(req.body);

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
