import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

/**
 * GET /api/users/profile
 * Fetch current authenticated user data
 */
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                isAdmin: true,
                addresses: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error: any) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};

/**
 * PUT /api/users/profile
 * Update user profile (name, email, phone)
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { name, email, phone } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        // Get current user to check if email is being changed
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email is already taken by another user (only if email is being changed)
        if (email.toLowerCase() !== currentUser.email.toLowerCase()) {
            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });

            if (existingUser) {
                return res.status(400).json({ message: "Email is already in use" });
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                phone: phone?.trim() || "",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                isAdmin: true,
                addresses: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error: any) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

/**
 * PUT /api/users/update-password
 * Update user password with bcrypt hashing
 */
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { currentPassword, newPassword } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        // Validate new password strength
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        // Find user and verify current password
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.json({ message: "Password updated successfully" });
    } catch (error: any) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Failed to update password" });
    }
};
