import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface CustomRequest extends Request {
    user?: JwtPayload
}

interface CustomJwtPayload extends JwtPayload {
    id: string;
    username: string;
    isAdmin: boolean;
}

export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('Authorization')?.split(' ')[1]

    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return
    }

    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
        req.user = verified;
        next();

    } catch (error) {
        console.error(`Error during token validation: ${error}`);
        res.status(401).json({ message: "Token not found" });
    }
}


export const validateAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('Authorization')?.split(' ')[1]
    console.log(token)
    if (!token) {
        res.status(401).json({ message: "Access denied, no token" });
        return
    }
    const decoded:JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
    console.log(decoded)
    if (!decoded.isAdmin) {
        res.status(403).json({ message: "Access denied." });
        return
    }
    next();
}