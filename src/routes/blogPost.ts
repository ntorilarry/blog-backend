import { createPost } from "../controllers/blogPost/createPost";

const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /Blog Post:
 *   post:
 *     summary: Create a post
 *     tags:
 *       - Blog Post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Post created successfully
 */
router.post("/", createPost);

module.exports = router;
