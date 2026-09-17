import type { Request, response, Response} from "express";
import { createPostSchema, updatePostSchema, type CreatePostInput, type UpdatePostInput } from "../utils/validators.js";
import { createUniqueSlug } from "../utils/slugify.js";
import { prisma } from "../config/database.config.js";
import { uploadImage } from "../services/cloudinary.service.js";

// Create Post

export const createPost = async (req: Request, res: Response) =>{
    try{
      
    const { success, data, error } = createPostSchema.safeParse(req.body);

    if(!success){
        return res.status(400).json({
            success: false,
            error: error.issues
        });
    }

    let imageUrl = null;

    if(req.file){
        const result = await uploadImage(req.file.buffer);
        imageUrl = result.secure_url;
        console.log(imageUrl);
    }

    const bodyData: CreatePostInput = data;
    
    const slug = createUniqueSlug(bodyData.title);

    const post = await prisma.post.create({
        data: {
            title: bodyData.title,
            slug: slug,
            description: bodyData.description ?? null,
            image: imageUrl,
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
        message: "Post Created Successfully",
        data: {
            post: {
                id: post.id,
                title: post.title,
                slug: post.slug,
                description: post.description,
                image: post.image,
                author: {
                    id: post.author.id,
                    name: post.author.name,
                    email: post.author.email
                },
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            }
        }
    });
    }catch(error){
        console.error("Create Post error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get Global Posts

export const getGlobalPosts  = async (req: Request, res: Response) =>{
    try{
        
    const { search, page, limit  }= req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 4;
    const skip = (pageNumber - 1) * limitNumber;

    const posts = await prisma.post.findMany({
        where: {
            ...(search? {
                OR: [
                    {
                        title: {
                            contains: search as string,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: search as string,
                            mode: "insensitive"
                        }
                    }
                ]
            }: {}),
        },
        include: {
            author: {
                select: {
                    id: true,
                    avatar: true,
                    name: true
                }
            },
            likes: {
                select: {
                    authorId: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        skip,
        take: limitNumber
        });


        const totalPosts = await prisma.post.count({
            where: {
                ...(search? {
                    OR: [
                        {
                            title: {
                                contains: search as string,
                                mode: "insensitive"
                            }
                        },
                        {
                            description: {
                                contains: search as string,
                                mode: "insensitive"
                            }
                        }
                    ]
                }: {})
            }
        });
        
    return res.json({
        success: true,
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            skip: skip,
            total: totalPosts,
            totalPages: Math.ceil(totalPosts / limitNumber)
        },
        data: posts.map((post) =>({
            id: post.id,
            title: post.title,
            description: post.description,
            slug: post.slug,
            image: post.image,
            author: {
                id: post.author.id,
                avatar: post.author.avatar,
                name: post.author.name
            },
            likes: post.likes.length,
            likedByMe: post.likes.some((like) =>(
                like.authorId === req.user.id
            )),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }))
    });
    }catch(error){
        console.error("Get Global Post error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Get post based on following

export const feed = async (req: Request, res: Response) =>{
    try{
        
    const { page, limit } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 4;
    const skip = (pageNumber - 1) * limitNumber;

    const following = await prisma.follow.findMany({
        where: {
            followerId: req.user.id
        },
        select: {
            followingId: true
        }
    });

    const followingIds = following.map((follow) =>(follow.followingId));

    const posts = await prisma.post.findMany({
        where: {
            authorId: {
                in: [...followingIds, req.user.id]
            }
        },
        include: {
            author: {
                select: {
                    id: true,
                    avatar: true,
                    name: true,
                    email: true,
                }
            },
            likes: {
                select: {
                    authorId: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        skip,
        take: limitNumber
    });

    const totalPosts = await prisma.post.count({
        where: {
            authorId: {
                in: [...followingIds, req.user.id]
            }
        }
    });

    return res.json({
        success: true,
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            total: totalPosts,
            totalPages: Math.ceil(totalPosts / limitNumber)
        },
        data: posts.map((post) =>({
            id: post.id,
            title: post.title,
            description: post.description,
            image: post.image,
            slug: post.slug,
            likes: post.likes.length,
            likedByMe: post.likes.some((like) =>(like.authorId === req.user.id)),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            author: {
                id: post.author.id,
                avatar: post.author.avatar,
                name: post.author.name,
                email: post.author.email
            }
        }))
    });
    }catch(error){
        console.error("Get Feed error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get single Post

export const getSinglePost = async (req: Request, res: Response) =>{

    const id = Number(req.params.id);

    const post = await  prisma.post.findUnique({
        where: {
            id: id 
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            },
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
            message: "Post NOt Found"
        });
    }

    return res.json({
        success: true,
        data: {
            id: post.id,
            title: post.title,
            description: post.description,
            image: post.image,
            slug: post.slug,
            author: {
                id: post.author.id,
                avatar: post.author.avatar,
                name: post.author.name
            },
            likes: post.likes.length,
            likedByMe: post.likes.some((like) =>(
                like.authorId === req.user.id
            )),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }
    });
}

// Delete Post

export const deletePost = async (req: Request, res: Response) =>{

    const id = Number(req.params.id);

    const post = await prisma.post.delete({
        where: {
            id: id,
            authorId: req.user.id
        }
    });

    return res.json({
        success: true,
        message: "Post Deleted"
    });
}

// Update Post 

export const updatePost = async (req: Request, res: Response) =>{

    const id = Number(req.params.id);

    const { success, data, error } = updatePostSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            success: false,
            error: error.issues
        });
    }
    
    const bodyData: UpdatePostInput = data;
    let slug;

    if(bodyData.title !== undefined){
         slug  = createUniqueSlug(bodyData.title);
    }

    const post = await prisma.post.update({
        where: {
            id: id,
            authorId: req.user.id
        },
        data: {
            ...(bodyData.title !== undefined && { title: bodyData.title }),
            ...(bodyData.description !== undefined && { description: bodyData.description }),
            ...(slug !== undefined && { slug: slug})
        }
    });

    return res.json({
        success: success,
        data: {
            id: post.id,
            title: post.title,
            description: post.description,
            slug: post.slug,
            authorId: post.authorId,
            image: post.image,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }
    });
}
