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

// Get All The Following List

export const getFollowing = async (req: Request, res: Response) =>{
    try{
        
    const id = Number(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({
            success: false,
            message: "Invalid User ID"
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            following: {
                include: {
                    following: {
                        select: {
                            id: true,
                            avatar: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User Not Found"
        });
    }

    return res.json({
        success: true,
        following: user.following.length,
        data: user.following.map((follow) => ( follow.following ))
    });

    }catch(error){
        console.error("Get Following error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get All The Followers List

export const getFollowers = async (req: Request, res: Response) =>{
    try{
        
    const id = Number(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({
            success: false,
            message: "Invalid User ID"
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            followers: {
                include: {
                    follower: {
                        select: {
                            id: true,
                            avatar: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User Not Found"
        });
    }

    return res.json({
        success: true,
        followers: user.followers.length,
        data: user.followers.map((follow) =>( follow.follower ))
    });
    }catch(error){
        console.error("Get Follower error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}