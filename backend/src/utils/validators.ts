import { z } from "zod";

export const registerSchema = z.object({
    name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name should not exceeds 50 characters"),
    email: z
    .string()
    .toLowerCase()
    .email("Invalid Email Address"),
    password: z
    .string()
    .trim()
    .min(8, "Password must be least be 8 characters")
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z
    .string()
    .toLowerCase()
    .email("Invalid Email Address"),
    password: z
    .string()
    .trim()
    .min(8, "Password must be least be 8 characters")
});

export type LoginInput = z.infer<typeof loginSchema>;