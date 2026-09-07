import type { Request, Response } from "express"
import { registerSchema, resendVerificationTokenSchema, type RegisterInput, type ResendVerificationTokenInput } from "../utils/validators.js"
import { prisma } from "../config/database.js";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
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
            if(!userExists.isVerified){
                return res.status(400).json({
                    success: false,
                    message: "User is already registered. Please verifiy your email or request a new verification link."
                })
            }

            return res.status(400).json({
                success: false,
                message: "User Already Exists! Please Enter a Valid Email"
            });
        }

        const hashedPassowrd = await bcrypt.hash(bodyData.password, 14);

        const verificationToken = randomBytes(32).toString("hex");

        const hashedVerificationToken = createHash('sha256').update(verificationToken).digest('hex');

        const verificationTokenExpiry = new Date(
            Date.now() + 1000 * 60 * 60
        )

        await prisma.user.create({
            data: {
                name: bodyData.name,
                email: bodyData.email,
                password: hashedPassowrd,
                verificationToken: hashedVerificationToken,
                verificationTokenExpiry: verificationTokenExpiry

            }
        });

        await sendEmail(bodyData.email, `Email Verification for the Blog Platform`, `<h1>Email Verification</h1>
            <p>Your verification token is: </p>
            <strong>${verificationToken}</strong>
            `);

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

// Verify Hashed Token

export const emailVerification = async (req: Request, res: Response) =>{

    const verifyEmail  = req.params.verifyEmail as string ;
    if(!verifyEmail){
        return res.status(400).json({
            success: false,
            message: "Please provide a verification token"
        });
    }

    const hashVerifyEmail = createHash('sha256').update(verifyEmail).digest('hex');


    const user = await prisma.user.findFirst({
        where: {
            verificationToken: hashVerifyEmail
        }
    });

    if(!user){
        return res.status(400).json({
            succss: false,
            message: "Invalid Verification Token"
        });
    }

    if(!user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()){
        return res.status(400).json({
            success: false,
            message: "Verification Token has expired"
        })
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data:{
            isVerified: true,
            verificationToken: null,
            verificationTokenExpiry: null
        }
    });

    return res.json({
        success: true,
        message: "Email Verified Succesfully"
    });
}

// Resend Token 

export const resendVerificationToken = async (req: Request, res: Response) =>{
    try{
        
    const { success, data, error } = resendVerificationTokenSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            success: false,
            error: error.issues
        });
    }

    const bodyData: ResendVerificationTokenInput = data;

    const user = await prisma.user.findUnique({
        where: {
            email: bodyData.email
        }
    });

    if(!user){
        return res.status(403).json({
            success: false,
            message: "User Not Found."
        });
    }

    if(user.isVerified){
        return res.status(400).json({
            success: false,
            message: "Email is already verified"
        });
    }

    const emailVerificationToken = randomBytes(32).toString("hex"); 

    const hashedVerificationToken = createHash("sha256").update(emailVerificationToken).digest("hex");

    const verificationTokenExpiry = new Date(
        Date.now() + 1000 * 60 * 60
    );

    await prisma.user.update({
        where: {
            email: bodyData.email
        },
        data:{
            verificationToken: hashedVerificationToken,
            verificationTokenExpiry: verificationTokenExpiry
        }
    }); 

    await sendEmail(bodyData.email, `Email Verification for the Blog Platform`, `<h1>Email Verification</h1>
        <p>Your Verification Token is: </p>
        <strong>${emailVerificationToken}</strong>
        `)

    return res.json({
        success: true,
        message: "Email Send Successfully"
    });
    }catch(error){
        console.error("Resend Email Verification error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }    
}