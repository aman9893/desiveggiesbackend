import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

/**
 * POST /api/search
 * Perform advanced search with filters, pagination, and sorting
 */
export const searchProducts = async (req: Request, res: Response) => {
    try {
        const { query, category, minPrice, maxPrice, sort, limit = 20, page = 1 } = req.body;

        // Validate input
        if (!query || query.trim().length === 0) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Build where clause
        const where: any = {
            AND: [
                {
                    OR: [
                        { name: { contains: query.trim(), mode: "insensitive" } },
                        { description: { contains: query.trim(), mode: "insensitive" } },
                    ],
                },
            ],
        };

        // Add category filter
        if (category && category !== "all") {
            where.category = {
                slug: category as string,
            };
        }

        // Add price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = Number(minPrice);
            if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
        }

        // Add stock filter (only in-stock items)
        where.stock = { gt: 0 };

        // Build orderBy clause
        const orderBy: any = {};
        if (sort === "price-low") {
            orderBy.price = "asc";
        } else if (sort === "price-high") {
            orderBy.price = "desc";
        } else if (sort === "newest") {
            orderBy.createdAt = "desc";
        } else if (sort === "popular") {
            orderBy.reviewCount = "desc";
        } else {
            orderBy.createdAt = "desc";
        }

        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Get total count for pagination
        const total = await prisma.product.count({ where });

        // Fetch products
        const products = await prisma.product.findMany({
            where,
            orderBy,
            include: { category: true },
            skip,
            take: Number(limit),
        });

        // Add discount calculation
        const productsWithDiscount = products.map((p: any) => {
            const discount =
                p.originalPrice && p.price
                    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                    : 0;
            return { ...p, discount };
        });

        // Calculate pagination info
        const totalPages = Math.ceil(total / Number(limit));
        const hasNextPage = Number(page) < totalPages;
        const hasPrevPage = Number(page) > 1;

        res.json({
            message: `Found ${total} products matching your search`,
            products: productsWithDiscount,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages,
                hasNextPage,
                hasPrevPage,
            },
            query: query.trim(),
        });
    } catch (error: any) {
        console.error("Error searching products:", error);
        res.status(500).json({ message: "Failed to search products" });
    }
};

/**
 * GET /api/search/suggestions
 * Get search suggestions based on partial query
 */
export const getSearchSuggestions = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || q.toString().trim().length < 2) {
            return res.json({ suggestions: [] });
        }

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: q as string, mode: "insensitive" } },
                    { description: { contains: q as string, mode: "insensitive" } },
                ],
                stock: { gt: 0 },
            },
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
            },
            take: 8,
        });

        const suggestions = products.map((p) => ({
            id: p.id,
            text: p.name,
            image: p.image,
            price: p.price,
        }));

        res.json({ suggestions });
    } catch (error: any) {
        console.error("Error getting search suggestions:", error);
        res.status(500).json({ message: "Failed to get search suggestions" });
    }
};

/**
 * GET /api/search/trending
 * Get trending/popular searches
 */
export const getTrendingSearches = async (req: Request, res: Response) => {
    try {
        // Get products with highest review count
        const trendingProducts = await prisma.product.findMany({
            where: { stock: { gt: 0 } },
            orderBy: { reviewCount: "desc" },
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                reviewCount: true,
            },
            take: 6,
        });

        const trending = trendingProducts.map((p) => ({
            id: p.id,
            name: p.name,
            image: p.image,
            price: p.price,
            reviewCount: p.reviewCount,
        }));

        res.json({ trending });
    } catch (error: any) {
        console.error("Error getting trending searches:", error);
        res.status(500).json({ message: "Failed to get trending searches" });
    }
};
