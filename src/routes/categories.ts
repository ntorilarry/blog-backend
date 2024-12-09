import { createCategory } from "../controllers/categories/createCategory";
import { deleteCategory } from "../controllers/categories/deleteCategory";
import { getAllCategories, getCategoryById } from "../controllers/categories/getCategory";
import { updateCategory } from "../controllers/categories/updateCategory";

const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
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
 *     responses:
 *       '200':
 *         description: List of all categories
 */
router.get("/", getAllCategories);


/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Category details
 *       '404':
 *         description: Category not found
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Category created successfully
 */
router.post("/", createCategory);

/**
 * @swagger
 * /categories:
 *   put:
 *     summary: Update category by ID
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the category to update
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               name:
 *                 type: string
 *                 description: The new name of the category
 *                 example: "Updated Category Name"
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *       '400':
 *         description: Missing required fields
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Internal server error
 */
router.put("/", updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags:
 *       - Categories
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
router.delete("/:id", deleteCategory);

module.exports = router;
