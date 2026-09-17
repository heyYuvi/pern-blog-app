import type { Request, Response } from "express"
import { prisma } from "../config/database.config.js";
// Toggle Follow

export const toggleFollow = async (req: Request, res: Response) =>{
    try{
        
    const id = Number(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({
            success: false,
            message: "Invalid User Id"
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User Not Found"
        });
    }

    if(user.id === req.user.id){
        return res.status(403).json({
            success: false,
            message: "Not Allowed"
        });
    }

    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: req.user.id,
                followingId: id
            }
        }
    });

    if(follow){
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: req.user.id,
                    followingId: id
                }
            }
        });
    } else{
        await prisma.follow.create({
            data: {
                followerId: req.user.id,
                followingId: id
            }
        });
    }

    return res.json({
        success: true,
        follow: !follow
    });
    }catch(error){
        console.error("Toggle Follow error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}