const express = require('express');
const router = express.Router();
const { justifyText } = require('../utils/justifText');

router.use(express.text({ type: 'text/plain' })); // Middleware pour parser le contenu de type text/plain

router.get('/api/justify', (req, res) => {
    const text = req.query.text;

    if (!text) {
        return res.status(400).json({ error: 'Texte requis' });
    }

    const justifiedText = justifyText(text);
    const responseText = `<p style="text-align: justify; width: 600px; ">${justifiedText}</p>`;

    router.use(express.text({ type: 'text/html' }));

    res.send(responseText);
});


router.post('/api/justify', (req, res) => {
    const text = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Texte requis' });
    }


    const justifiedText = justifyText(req.body);
    console.log('Justified text:', justifiedText);

    res.setHeader('Content-Type', 'text/html');
    res.send(`<p style="text-align: justify; width: 600px;">${justifiedText}</p>`);
});




module.exports = router;
