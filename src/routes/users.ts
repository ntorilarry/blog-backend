import { getUsers, getUsersById } from "../controllers/users/getUsers";

const express = require("express");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUsersById);

module.exports = router;
