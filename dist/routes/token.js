"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_1 = require("../controllers/token");
const router = (0, express_1.Router)();
router.post('/', token_1.validateEmail, token_1.generateToken);
exports.default = router;
