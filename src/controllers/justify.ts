import toobusy from 'toobusy-js';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'; 
import createDOMPurify from 'dompurify';
const { justifyText } = require('../../utils/justifyText');
import { Request, Response, NextFunction } from 'express';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const JWT_SECRET: string = "YOUR_SECRET_KEY";
const RATE_LIMIT: number = 80000;

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);


type DailyWordCount = Record<string, number>;


const processAndJustifyText = (inputText: string): string => {
    try {
        let text: string = DOMPurify.sanitize(inputText.toString());
        if (!text) {
            throw new Error('Texte requis');
        }

        const justifiedText: string = justifyText(text);
        return justifiedText.replace(/\n/g, '<br>');
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error during text justification:", error.message);
        } else {
            console.error("An unexpected error occurred:", error);
        }
        throw error;
    }
};

interface ExtendedRequest extends Request {
    email?: string;
}

// export function getErrorMessage(error: unknown) {
//     if (error instanceof Error) return error.message;
//     return String(error)
// }



export const authorizeUser = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const bearerHeader: string | undefined = req.headers['authorization'] as string;
    if (!bearerHeader) return res.status(401).json({ error: 'Token is required' });

    const token: string = bearerHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: any | undefined) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        req.email = decoded?.email;
        console.log('Authorization successful. Proceeding to the next handler.');

        if (!req.body || typeof req.body.text !== 'string') {
            return res.status(400).send('Invalid input.');
        }
        next();
    });
};


const dailyWordCount: DailyWordCount = {};

export const postJustify = (req: ExtendedRequest, res: Response): void => {
    // Check server load
    if (toobusy()) {
        res.status(503).send("I'm busy right now, sorry, wait 1 minute.");
        return;  // Explicitly return after sending response
    }

    // Check if text is provided
    if (!req.body.text || typeof req.body.text !== 'string') {
        res.status(400).send('Text data is missing or invalid.');
        return;
    }

    // Calculate word count
    const wordCount: number = req.body.text.split(' ').length;

    // Update daily word count
    if (dailyWordCount[req.email!]) { // Use non-null assertion because we know email exists here.
        dailyWordCount[req.email!] += wordCount;
    } else {
        dailyWordCount[req.email!] = wordCount;
    }

    // Check if rate limit exceeded
    if (dailyWordCount[req.email!] > RATE_LIMIT) {
        res.status(402).send('Payment Required');
        return
    }

    // Process and justify text
    const responseText: string = `<p style="text-align: justify; width: 600px;">${processAndJustifyText(req.body.text)}</p>`;

    // Send response
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.send(responseText);
};

export const getJustify = (req: Request, res: Response): void => {
    if (toobusy()) {
        res.status(503).send("I'm busy right now, sorry, wait 1 minute.");
        return
    }

    try {
        const responseText: string = `<p style="text-align: justify;">${processAndJustifyText(req.query.text as string)}</p>`;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.send(responseText);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error during text justification:", error.message);

            res.status(400).json({ error: error.message });
        }
        return
    }
};


