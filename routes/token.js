const express = require('express');
const router = express.Router();

const { validateEmail, generateToken } = require('../controllers/token');

router.post('/', validateEmail, generateToken);


module.exports = router;
