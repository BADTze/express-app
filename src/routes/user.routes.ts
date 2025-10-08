import { Router } from "express";
import { getUsers, getUserById, createUser, deleteUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.delete("/:id", deleteUser);

export default router;
