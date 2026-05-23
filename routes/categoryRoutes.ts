import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController";
import auth from "../middleware/auth";
import adminAuth from "../middleware/admin";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.post("/", auth, adminAuth, createCategory);
categoryRouter.put("/:id", auth, adminAuth, updateCategory);
categoryRouter.delete("/:id", auth, adminAuth, deleteCategory);

export default categoryRouter;
