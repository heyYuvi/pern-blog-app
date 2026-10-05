import { type Request, type Response } from "express"
import { prisma } from "../config/database.config.js";
import { updatePostSchema, updateProfileSchema, type profileInput } from "../utils/validators.js";
import { avatarUpload } from "../services/cloudinary.service.js";


export const getProfile = async (req: Request, res: Response) => {
    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Please Enter Valid ID"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                posts: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        image: true
                    }
                },
                followers: {
                    select: {
                        followerId: true,
                    }
                },
                following: {
                    select: {
                        followingId: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        return res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    posts: user.posts,
                    followers: user.followers,
                    following: user.following
                }
            }
        });
    } catch (error) {
        console.error("Get Profile error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {

        let imageUrl = null;

        const { success, data, error } = updateProfileSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                error: error.issues
            });
        }

        if(req.file){
            const result = await avatarUpload(req.file?.buffer);
            imageUrl = result.secure_url;
            console.log(imageUrl);
        }

        const updateProfileData: profileInput = data;

        const id = req.user.id;

        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                ...(updateProfileData.name !== undefined && {
                    name: updateProfileData.name
                }),
                ...(imageUrl !== null && {
                    avatar: imageUrl
                })
            },
            include: {
                posts: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        image: true
                    }
                },
                followers: {
                    select: {
                        followerId: true
                    }
                },
                following: {
                    select: {
                        followingId: true
                    }
                }
            }
        });


        return res.json({
            success: true,
            message: "Updated Succesfully",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    posts: user.posts,
                    followers: user.followers,
                    following: user.following
                }
            }
        });

    } catch (error) {
        console.error("Update Profile Error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}