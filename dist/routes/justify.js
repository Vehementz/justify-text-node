"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const justify_1 = require("../controllers/justify");
const justify_2 = require("../controllers/justify");
const router = (0, express_1.Router)();
// Middleware to authenticate and authorize user for all routes in this router
router.use(justify_2.authorizeUser);
router.post('/', justify_1.postJustify);
// router.get('/', justifyController.getJustify);
exports.default = router;
