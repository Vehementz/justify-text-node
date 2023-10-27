"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJustify = exports.postJustify = exports.authorizeUser = void 0;
const toobusy_js_1 = __importDefault(require("toobusy-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dompurify_1 = __importDefault(require("dompurify"));
const { justifyText } = require('../utils/justifyText');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const JWT_SECRET = "YOUR_SECRET_KEY";
const RATE_LIMIT = 80000;
const window = (new JSDOM('')).window;
const DOMPurify = (0, dompurify_1.default)(window);
const processAndJustifyText = (inputText) => {
    try {
        let text = DOMPurify.sanitize(inputText.toString());
        if (!text) {
            throw new Error('Texte requis');
        }
        const justifiedText = justifyText(text);
        return justifiedText.replace(/\n/g, '<br>');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error during text justification:", error.message);
        }
        else {
            console.error("An unexpected error occurred:", error);
        }
        throw error;
    }
};
// export function getErrorMessage(error: unknown) {
//     if (error instanceof Error) return error.message;
//     return String(error)
// }
const authorizeUser = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader)
        return res.status(401).json({ error: 'Token is required' });
    const token = bearerHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Token is required' });
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(401).json({ error: 'Invalid token' });
        req.email = decoded === null || decoded === void 0 ? void 0 : decoded.email;
        console.log('Authorization successful. Proceeding to the next handler.');
        if (!req.body || typeof req.body.text !== 'string') {
            return res.status(400).send('Invalid input.');
        }
        next();
    });
};
exports.authorizeUser = authorizeUser;
const dailyWordCount = {};
const postJustify = (req, res) => {
    // Check server load
    if ((0, toobusy_js_1.default)()) {
        res.status(503).send("I'm busy right now, sorry, wait 1 minute.");
        return; // Explicitly return after sending response
    }
    // Check if text is provided
    if (!req.body.text || typeof req.body.text !== 'string') {
        res.status(400).send('Text data is missing or invalid.');
        return;
    }
    // Calculate word count
    const wordCount = req.body.text.split(' ').length;
    // Update daily word count
    if (dailyWordCount[req.email]) { // Use non-null assertion because we know email exists here.
        dailyWordCount[req.email] += wordCount;
    }
    else {
        dailyWordCount[req.email] = wordCount;
    }
    // Check if rate limit exceeded
    if (dailyWordCount[req.email] > RATE_LIMIT) {
        res.status(402).send('Payment Required');
        return;
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
exports.postJustify = postJustify;
const getJustify = (req, res) => {
    if ((0, toobusy_js_1.default)()) {
        res.status(503).send("I'm busy right now, sorry, wait 1 minute.");
        return;
    }
    try {
        const responseText = `<p style="text-align: justify;">${processAndJustifyText(req.query.text)}</p>`;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.send(responseText);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error during text justification:", error.message);
            res.status(400).json({ error: error.message });
        }
        return;
    }
};
exports.getJustify = getJustify;
