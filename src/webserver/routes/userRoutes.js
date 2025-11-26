import express from "express";
import {
    register,
    profile,
    confirm,
    authenticate
} from "../controllers/userController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", register);
router.get("/confirmar/:token", confirm);
router.post("/login", authenticate);

// Private routes
router.get("/profile", checkAuth, profile);

export default router;
