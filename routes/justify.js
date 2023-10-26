const express = require('express');
const router = express.Router();
const justifyController = require('../controllers/justify');

// Middleware to authenticate and authorize user for all routes in this router
router.use(justifyController.authorizeUser);
router.post('/', justifyController.postJustify);
// router.get('/', justifyController.getJustify);

module.exports = router;
