"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Assuming config has a default export, if not adjust the import
// import config from '../config.json';
const justify_1 = __importDefault(require("./routes/justify"));
const token_1 = __importDefault(require("./routes/token"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, morgan_1.default)('dev'));
// You can use express built-in body-parser for json and text 
app.use(express_1.default.json());
// Uncomment if you're parsing plain text
// app.use(express.text({ type: 'text/plain' }));
// Rate limiter - apply only to /api/justify endpoint
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.'
});
// Routes
app.use('/api/justify', apiLimiter);
app.use('/api/justify', justify_1.default);
app.use('/api/token', token_1.default);
// Start the server
const port = 8080;
app.listen(port, () => {
    console.log(`A node js api is listening on port: 8080`);
});
