import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
};

// Check if user is admin
const getAdminStatus = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()) : [];
    return adminEmails.includes(email.toLowerCase());
};

// Register
// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;

    // Validate input - either email or phone required
    if (!name || !password || (!email && !phone)) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check for existing user by email if email is provided
    if (email) {
        const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize phone: remove all spaces and special characters
    const normalizedPhone = phone ? phone.replace(/\s+/g, '').replace(/[^\d+]/g, '') : null;

    const user = await prisma.user.create({
        data: {
            name,
            email: email ? email.toLowerCase() : null,
            phone: normalizedPhone,
            password: hashedPassword,
        },
    });

    const token = generateToken(user.id);

    const userData: any = { ...user };
    delete userData.password;
    userData.isAdmin = getAdminStatus(userData.email);

    res.status(201).json({ user: userData, token });
};

// Login
// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
        return res.status(400).json({ message: "Please provide email or phone and password" });
    }

    let user;

    // Find user by email or phone
    if (email) {
        user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, include: { addresses: true } });
    } else if (phone) {
        // Normalize phone: remove all spaces and special characters
        const normalizedPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
        user = await prisma.user.findFirst({ 
            where: { phone: normalizedPhone }, 
            include: { addresses: true } 
        });
    }

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    const userData: any = { ...user };
    delete userData.password;
    userData.isAdmin = getAdminStatus(userData.email);

    res.json({ user: userData, token });
};
