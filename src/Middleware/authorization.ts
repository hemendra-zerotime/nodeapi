import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY
export const isLogin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authtoken || req.headers.authorization?.split(" ")[1]
    if (token !== undefined) {
        try {
            const decoded = await jwt.verify(`${token}`, `${secretKey}`)
            req.body = decoded
            next()
        } catch (error) {
            res.status(401).json({ message: "invalid token or token expire please login again" })
        }
    }
    else {
        res.status(401).json({ message: "please login" })
    }
}

export const userAuth = (req: Request, res: Response) => {
    if (req.body !== undefined) {
        const { username, email, role } = req.body
        res.status(200).json({
            message: `${username} profile get successfully`,
            userInfo: {
                username,
                email,
                role
            }
        })
    }
};

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role === "admin") {
        next()
    }
    else if (req.body.role === "user") {
        res.status(401).json({ message: `Access denied only admin can access` })
    }
};

