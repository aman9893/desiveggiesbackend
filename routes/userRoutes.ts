import express from "express";
import auth from "../middleware/auth.js";
import { getProfile, updateProfile, updatePassword } from "../controllers/userController.js";

const userRouter = express.Router();

// Get current user profile - requires authentication
userRouter.get("/profile", auth, getProfile);

// Update user profile (name, email, phone) - requires authentication
userRouter.put("/profile", auth, updateProfile);

// Update password - requires authentication
userRouter.put("/update-password", auth, updatePassword);

export default userRouter;
