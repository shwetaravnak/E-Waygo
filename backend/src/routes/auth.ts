import express from "express";
import { register, login, getUsers, sendResetCode, resetPassword } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", sendResetCode);
router.post("/reset-password", resetPassword);
router.get("/users", authMiddleware, getUsers);

export default router;
