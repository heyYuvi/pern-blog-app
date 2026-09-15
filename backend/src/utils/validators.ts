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

export const resendVerificationTokenSchema = z.object({
    email: z.
    string().
    toLowerCase().
    email("Invalid Email Address")
});

export type ResendVerificationTokenInput = z.infer<typeof resendVerificationTokenSchema>;


export const createPostSchema = z.object({
    title: z
    .string()
    .trim()
    .min(1, "Ttile must at least be 1 character")
    .max(300, "Ttitle should not exceeds 300 characters")
    ,
    description: z
    .string()
    .max(1000, "Description should not excceeds 1000 characters")
    .optional()
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
    title: z
    .string()
    .trim()
    .max(300, "Title should not exceed   300 characters")
    .optional(),
    description: z
    .string()
    .max(1000, "Description should not exceed 1000 characters")
    .optional()
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const commentSchema = z.object({
    content: z
    .string()
    .trim()
    .max(100, "Comment Should not exceeds 100 characters")
});


export type CommentInput = z.infer<typeof commentSchema>;

