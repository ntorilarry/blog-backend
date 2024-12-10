import { likePost } from "../controllers/likes/likePost";

const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /like-post:
 *   post:
 *     summary: Like or Unlike a post
 *     tags:
 *       - Like/Unlike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: string
 *                 description: The ID of the user performing the action.
 *               postId:
 *                 type: string
 *                 description: The ID of the post to be liked or unliked.
 *               action:
 *                 type: boolean
 *                 description: true to like the post, false to unlike the post.
 *     responses:
 *       '200':
 *         description: Post liked or unliked successfully.
 *       '400':
 *         description: Validation error or bad request.
 *       '404':
 *         description: Resource not found (e.g., invalid postId or authorId).
 *       '500':
 *         description: Internal server error.
 */

router.post("/", likePost);

module.exports = router;
