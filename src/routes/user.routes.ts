import { Router } from "express";
import { getUsers, getUserById, createUser, deleteUser } from "../controllers/user.controller";
import { userSchema } from "../validator/validator";
import { validateRequest } from "../middleware/validate-request";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", validateRequest(userSchema), createUser);
router.delete("/:id", deleteUser);

export default router;
