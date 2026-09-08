import type { NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";

interface Payload {
    id: number
}

const protect = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Token Not Provided"
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Payload;

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id 
        }
    });

    if(!user){
        return res.status(401).json({
            success: false,
            message: "User Not Found"
        });
    }

    req.user = user
    
    next();
    }catch(error){
        console.error("Auth Middleware error: ", error);
        return res.status(500).json({
            success: false,
            message: "Token Not Provided Or Invalid Token"
        });
    }
}

export default protect;