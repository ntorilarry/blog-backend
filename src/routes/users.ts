import { getUsers, getUsersById } from "../controllers/getUsers";

const express = require("express");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUsersById);

module.exports = router;
