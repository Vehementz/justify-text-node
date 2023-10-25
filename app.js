const express = require('express');
const app = express();
const morgan = require("morgan");
const justifyRoute = require('./routes/justify');
const rateLimit = require('express-rate-limit');

// Define rate limiter middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                 // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

app.use(morgan("dev"));

// Apply the rate limiter only to requests that begin with /api/justify
app.use("/api/justify", apiLimiter);
app.use("/", justifyRoute);

const port = 8080;
app.listen(port, () => {
    console.log(`A node js api is listening on port: ${port}`);
});
