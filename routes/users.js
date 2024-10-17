import express from "express";
import { getUsers, postUsers, deleteUsers, getUserById, deleteUserById, patchUserById } from "../controllers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", postUsers);
router.delete("/", deleteUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserById);
router.patch("/:id", patchUserById);

export default router;