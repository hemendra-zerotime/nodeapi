import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY
export const isLogin = async (req: Request, res: Response, next: NextFunction) => {
    const token =  req.cookies.authtoken || req.headers.authorization?.split(" ")[1]
    if (token !==undefined) {
        try {
            const decoded = await jwt.verify(`${token}`, `${secretKey}`)
            req.body = decoded
            next()
        } catch (error) {
            res.status(401).json({ message: "invalid token or token expire please login again" })
        }
    }
    else  {
        res.status(401).json({ message: "please login" })
    }
}

export const authData = (req: Request, res: Response) => {
    if (req.body !== undefined) {
        res.status(200).json({ message: `data access by ${req.body.username} which is ${req.body.role}` })
    }
};

export const adminData = (req: Request, res: Response) => {
    if (req.body.role ==="admin") {
        res.status(200).json({ message: `Access granted` })
    }
    else if(req.body.role ==="user")
    {
        res.status(401).json({ message: `Access denied only admin can access` })
    }
};

