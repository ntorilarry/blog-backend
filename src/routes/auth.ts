import { signUp } from "../controllers/signUp";

const express = require("express");

const router = express.Router();

router.post("/sign-up", signUp);

module.exports = router;
