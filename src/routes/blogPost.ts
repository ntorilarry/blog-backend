import { createPost } from "../controllers/blogPost/createPost";
import { deletePost } from "../controllers/blogPost/deletePost";
import { getPostById, getPosts } from "../controllers/blogPost/getPost";
import { updatePost } from "../controllers/blogPost/updatePost";

const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /blog-post:
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
 *               content:
 *                 type: string
 *               authorId:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Post created successfully
 *       '400':
 *         description: Failed to create the post.
 *       '500':
 *         description: Internal server error.
 */

router.post("/", createPost);

/**
 * @swagger
 * /blog-post:
 *   get:
 *     summary: Get all blog Post
 *     tags:
 *       - Blog Post
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
 *         description: Filter posts by author ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         required: false
 *         description: Filter posts by category ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of all post
 */
router.get("/", getPosts);

/**
 * @swagger
 * /blog-post/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags:
 *       - Blog Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: post ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: post details
 *       '404':
 *         description: post not found
 */
router.get("/:id", getPostById);


/**
 * @swagger
 * /blog-post:
 *   put:
 *     summary: Update post by ID
 *     tags:
 *       - Blog Post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               authorId:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Post updated successfully
 *       '400':
 *         description: Failed to create the post.
 *       '500':
 *         description: Internal server error.
 */

router.put("/", updatePost);

/**
 * @swagger
 * /blog-post/{id}:
 *   delete:
 *     summary: Delete post by ID
 *     tags:
 *       - Blog Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 */
router.delete("/:id", deletePost);

module.exports = router;
