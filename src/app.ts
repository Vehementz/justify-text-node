import express, { Router, Express } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
// Assuming config has a default export, if not adjust the import
// import config from '../config.json';

import justifyRoute from './routes/justify';
import tokenRoute from './routes/token';

const app: Express = express();
const bodyParser = require('body-parser');
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.json());
// Middlewares
app.use(morgan('dev'));

// You can use express built-in body-parser for json and text 
app.use(express.json());
// Uncomment if you're parsing plain text
// app.use(express.text({ type: 'text/plain' }));

// Rate limiter - apply only to /api/justify endpoint
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                  // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// Routes
app.use('/api/justify', apiLimiter);
app.use('/api/justify', justifyRoute);
app.use('/api/token', tokenRoute);

// Start the server
const port: number = 8080;
app.listen(port, () => {
    console.log(`A node js api is listening on port: 8080`);
});
