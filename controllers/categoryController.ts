import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// Get all categories
// GET /api/categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: "asc" },
        });
        res.json({ categories });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new category (Admin only)
// POST /api/categories
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug, image } = req.body;

        if (!name || !slug || !image) {
            return res.status(400).json({ message: "Please provide name, slug, and image" });
        }

        const existing = await prisma.category.findUnique({
            where: { slug },
        });

        if (existing) {
            return res.status(400).json({ message: "Category with this slug already exists" });
        }

        const category = await prisma.category.create({
            data: { name, slug, image },
        });

        console.log(`➕ CATEGORY CREATED: ${category.name} (ID: ${category.id}, Slug: ${category.slug})`);

        res.status(201).json({ category });
    } catch (error: any) {
        console.error(`❌ Create Category Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Update a category (Admin only)
// PUT /api/categories/:id
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, slug, image } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const existing = await prisma.category.findUnique({
            where: { id },
        });

        if (!existing) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (slug && slug !== existing.slug) {
            const slugExists = await prisma.category.findUnique({
                where: { slug },
            });
            if (slugExists) {
                return res.status(400).json({ message: "Slug already in use" });
            }
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(image && { image }),
            },
        });

        console.log(`✏️  CATEGORY UPDATED: ${category.name} (ID: ${id})`);
        console.log(`   Fields updated: ${[name ? "name" : null, slug ? "slug" : null, image ? "image" : null].filter(Boolean).join(", ")}`);

        res.json({ category });
    } catch (error: any) {
        console.error(`❌ Update Category Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Delete a category (Admin only)
// DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await prisma.category.delete({
            where: { id },
        });

        console.log(`🗑️  CATEGORY DELETED: ${category.name} (ID: ${id})`);

        res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
        console.error(`❌ Delete Category Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};
