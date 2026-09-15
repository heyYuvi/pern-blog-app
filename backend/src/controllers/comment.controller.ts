import type { Request, Response } from "express";
import { commentSchema, type CommentInput } from "../utils/validators.js";
import { prisma } from "../config/database.config.js";


// Add Comment to a post

export const addComment = async (req: Request, res: Response) => {
    try {
        const { success, data, error } = commentSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                error: error.issues
            });
        }

        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID"
            });
        }

        const bodyData: CommentInput = data;

        console.log(req.user);

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found "
            });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: id
            }
        });

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post Not Found"
            });
        }

        const comment = await prisma.comment.create({
            data: {
                content: bodyData.content,
                postId: id,
                authorId: req.user.id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return res.status(201).json({
            success: true,
            message: "Comment Added",
            comment
        });
    } catch (error) {
        console.error("Create Comment error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// See All The Comments for a post

export const getComments = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post Id"
            });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: id
            }
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found"
            });
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId: id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.json({
            success: true,
            comments
        });
    } catch (error) {
        console.error("Get Comments error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Delete Comment

export const deleteComment = async (req: Request, res: Response) =>{
    try{
        
    const { postId: postIdString, commentId: commentIdString } = req.params;

    const postId = Number(postIdString);
    const commentId = Number(commentIdString);
    
    if(isNaN(postId) || isNaN(commentId)){
        return res.status(400).json({
            success: false,
            message: "Invalid Post or Comment Id"
        });
    }

    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId,
            postId: postId
        }
    });

    if(!comment){
        return res.status(404).json({
            success: false,
            message: "Comment Not Found"
        });
    }

    if(comment.authorId !== req.user.id){
        return res.status(403).json({
            success: false,
            message: "Not Allowed"
        });
    }

    await prisma.comment.delete({
        where: {
            id: commentId
        }
    });

    return res.json({
        success: true,
        message: "Comment Deleted"
    });
    }catch(error){
        console.error("Delete Comment error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}