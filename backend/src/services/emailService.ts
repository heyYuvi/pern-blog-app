    import nodemailer from "nodemailer";
    import "dotenv/config";

    const transpoter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER as string,
            pass: process.env.SMTP_PASS as string
        }
    });

    export const sendEmail = async (to: string, subject: string, html: string) =>{
        const info = await transpoter.sendMail({
            from: `Blog Application ${process.env.SMTP_USER}`,
            to,
            subject,
            html
        });

        return info;
    }