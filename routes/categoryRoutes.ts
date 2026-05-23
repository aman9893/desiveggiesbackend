import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/admin.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.post("/", auth, adminAuth, createCategory);
categoryRouter.put("/:id", auth, adminAuth, updateCategory);
categoryRouter.delete("/:id", auth, adminAuth, deleteCategory);

export default categoryRouter;
