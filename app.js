// Module imports
const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const justifyRoute = require('./routes/justify');
const tokenRoute = require('./routes/token');

// Create the Express app
const app = express();

// Middlewares
app.use(morgan("dev"));           // Logging middleware
app.use(bodyParser.json());        // For parsing JSON in requests

// Rate limiter - apply only to /api/justify endpoint
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 100,                    // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});
app.use("/api/justify", apiLimiter);

// Route handlers
app.use("/api/token", tokenRoute);
app.use("/api/justify", justifyRoute); // You can keep this after the tokenRoute as both have distinct paths
app.use("/", (req, res) => res.send('API is running...')); // Simple home route for clarity

// Start the server
const port = 8080;
app.listen(port, () => {
    console.log(`A node js api is listening on port: ${port}`);
});
