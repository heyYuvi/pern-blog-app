import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes\/comment.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.get("/health", (req, res) =>{
    res.json({
        success: true,
        message: "Blog Application is Running"
    });
});

app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);

export default app;