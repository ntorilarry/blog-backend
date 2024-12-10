import { createComment } from "../controllers/comments/createComment";
import { deleteComment } from "../controllers/comments/deleteComment";
import { getComment, getCommentById } from "../controllers/comments/getComment";
import { updateComment } from "../controllers/comments/updateComment";

const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a comment
 *     tags:
 *       - Comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               authorId:
 *                 type: string
 *               postId:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Comment created successfully
 *       '400':
 *         description: Failed to create the comment.
 *       '500':
 *         description: Internal server error.
 */

router.post("/", createComment);

/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Get all comment
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: size
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: authorId
 *         required: false
 *         description: Filter comments by author ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: postId
 *         required: false
 *         description: Filter comments by post ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of all comments
 */
router.get("/", getComment);

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get comment by ID
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: comment ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: comment details
 *       '404':
 *         description: comment not found
 */
router.get("/:id", getCommentById);

/**
 * @swagger
 * /comment:
 *   put:
 *     summary: Update comment by ID
 *     tags:
 *       - Comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               content:
 *                 type: string
 *               authorId:
 *                 type: string
 *               postId:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 *       '400':
 *         description: Failed to create the comment.
 *       '500':
 *         description: Internal server error.
 */

router.put("/", updateComment);

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete comment by ID
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 */
router.delete("/:id", deleteComment);

module.exports = router;
