import type { Request, Response } from "express"
import { prisma } from "../config/database.config.js";


export const toggleLike = async (req: Request, res: Response) =>{
    try{
        
    const id = Number(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({
            success: false,
            message: "Invalid Post ID"
        });
    }

    const post = await prisma.post.findUnique({
        where: {
            id: id,
        },
        include: {
            likes: {
                select: {
                    authorId: true
                }
            }
        }
    });

    if(!post){
        return res.status(404).json({
            success: false,
            message: "Post Not Found"
        });
    }

    const alreadyLiked = post.likes.some((like) =>(
        like.authorId === req.user.id
    ));

    if(alreadyLiked){
        await prisma.like.delete({
            where: {
                authorId_postId: {
                    postId: id,
                    authorId: req.user.id,
                }
            }
        });
    }else {
        await prisma.like.create({
            data: {
                postId: id,
                authorId: req.user.id
            }
        });
    }

    return res.json({
        success: true,
        like: !alreadyLiked, 
    });
    }catch(error){
        console.error("Toggle Like error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}