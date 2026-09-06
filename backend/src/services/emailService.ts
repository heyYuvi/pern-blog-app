import "dotenv/config";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string
    }
});

try{
    await transporter.verify()
console.log("Server is ready to take our message");
}catch(error){
    console.error("Verification Failed", error);
}


export const sendEmail = async (to: string, subject: string, html: string) =>{
    try{
    const info = await transporter.sendMail({
        from: `Blog Application ${process.env.SMTP_USER}`,
        to,
        subject,
        html
    });

    return info;
    }catch(error){
        console.error("Error while sending mail", error);
    }
}