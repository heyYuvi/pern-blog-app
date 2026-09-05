import type { Request, Response } from "express"
import { registerSchema, type RegisterInput } from "../utils/validators.js"
import { prisma } from "../config/database.js";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { sendEmail } from "../services/emailService.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { success, data, error } = registerSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                error: error.issues
            });
        }

        const bodyData: RegisterInput = data;

        const userExists = await prisma.user.findUnique({
            where: {
                email: bodyData.email
            }
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists! Please Enter a Valid Email"
            });
        }

        const hashedPassowrd = await bcrypt.hash(bodyData.password, 14);

        const verificationToken = randomBytes(32).toString('hex');

        const verificationTokenExpiry = new Date(
            Date.now() + 1000 * 60 * 60    // 1 sec + 1 min + 1 hour
        )

        await sendEmail(
            bodyData.email,
            "Email Verification",
            `<h1>Email Verification</h1>
            <p>Your verification token is:</p>
            <strong>${verificationToken}</strong>`
        );

        await prisma.user.create({
            data: {
                name: bodyData.name,
                email: bodyData.email,
                password: hashedPassowrd,
                verificationToken: verificationToken,
                verificationTokenExpiry: verificationTokenExpiry

            }
        });

        return res.status(201).json({
            success: true,
            message: "User Registered"
        });
    } catch (error) {
        console.error("Register error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}