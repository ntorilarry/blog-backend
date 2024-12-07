import { getUsers, getUsersById } from "../controllers/users/getUsers";
import { logIn } from "../controllers/auth/logIn";
import { signUp } from "../controllers/auth/signUp";
import { requestPasswordReset } from "../controllers/auth/requestPasswordReset";
import { resetPassword } from "../controllers/auth/resetPassword";

const express = require("express");

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/log-in", logIn);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
