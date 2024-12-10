const express = require("express");
import { logIn } from "../controllers/auth/logIn";
import { signUp } from "../controllers/auth/signUp";
import { requestPasswordReset } from "../controllers/auth/requestPasswordReset";
import { resetPassword } from "../controllers/auth/resetPassword";
import { verifyEmail } from "../controllers/auth/verifyEmail";

const router = express.Router();

/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: User Sign-Up
 *     description: Registers a new user in the system.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 02xxxxxxxx
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       '200':
 *         description: User registered successfully.
 *       '400':
 *         description: Validation error.
 *       '500':
 *         description: Internal server error.
 */
router.post("/sign-up", signUp);

/**
 * @swagger
 * /log-in:
 *   post:
 *     summary: User Login
 *     description: Authenticates a user and returns a JWT token upon successful login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       '200':
 *         description: Login successful.
 *       '400':
 *         description: Invalid credentials.
 *       '500':
 *         description: Internal server error.
 */
router.post("/log-in", logIn);

/**
 * @swagger
 * /request-password-reset:
 *   post:
 *     summary: Request Password Reset
 *     description: Sends a password reset email to the user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       '200':
 *         description: Password reset email sent successfully.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 */
router.post("/request-password-reset", requestPasswordReset);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Resets the user's password using a token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "reset-token"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *     responses:
 *       '200':
 *         description: Password reset successfully.
 *       '400':
 *         description: Invalid token or missing fields.
 *       '500':
 *         description: Internal server error.
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /verify-email:
 *   get:
 *     summary: Verify email
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: pass the email token here
 *         schema:
 *           type: string
 *           example: "email token"
 *     responses:
 *       '200':
 *         description: Verify email
 */
router.get("/verify-email", verifyEmail);

module.exports = router;
