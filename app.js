// Module imports
const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const router = express.Router();
// const { router: justifyRoute } = require('./routes/justify');  // Adjusted import
const tokenRoute = require('./routes/token');
const config = require('./config')
const justifyRoute = require('./routes/justify');
console.log(justifyRoute);

// Create the Express app
const app = express();

// Middlewares
app.use(morgan("dev"));           // Logging middleware
// app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.json());
// app.use(bodyParser.text({ type: 'text/plain' }));


// Rate limiter - apply only to /api/justify endpoint
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 100,                    // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// Routes
// app.use("/api/token", tokenRoute);  // Uncomment if you're using tokenRoute

app.use("/api/justify", apiLimiter);
app.use("/api/justify", justifyRoute);
app.use("/api/token", tokenRoute);

// Start the server
const port = config.PORT;
app.listen(port, () => {
    console.log(`A node js api is listening on port: ${config.PORT}`);
});
