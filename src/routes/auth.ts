import { getUsers, getUsersById } from "../controllers/getUsers";
import { signUp } from "../controllers/signUp";

const express = require("express");

const router = express.Router();

router.post("/sign-up", signUp);
router.get("/users", getUsers);
router.get("/users/:id", getUsersById);

module.exports = router;
