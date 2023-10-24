const express = require("express");
const postController = require('../controllers/post');
const router = express.Router();

router.get('/api/posts', postController.getPosts);
router.get('/post/:title', postController.getPostByTitle);

module.exports = {
    postRoutes: router
};
