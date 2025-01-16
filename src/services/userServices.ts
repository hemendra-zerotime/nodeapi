import { NextFunction, Request, Response } from "express"
import fs from "fs"
import path from "path"
import User from "../Model/userModel"
import bcrypt from "bcrypt"
declare global {
    namespace Express {
        interface Request {
            users: User[]
        }
    }
}
const file = path.join(__dirname, "../../Users.json")
export const read = (req: Request, res: Response, next: NextFunction) => {
    let users: User[] = JSON.parse(fs.readFileSync(file, "utf-8"))
    req.users = users
    next();
}

export const newUserCreate = async (req: Request) => {
    const { users } = req
    let { username, email, password, role } = req.body
    let ID: number
    if (users.length === 0)
        ID = 1
    else
        ID = users[users.length - 1].id + 1
    const saltRound = 10;
    const hashpass = await bcrypt.hash(password, saltRound)
    password = hashpass
    if (role === undefined) {
        role = "user"
    }
    let newuser = Object.assign({ id: ID }, { username, email, password, role })
    return newuser
}


export const findUser = async (req: Request) => {
    const result = req.users.find((user) => user.email === req.body.email)
    if (result === undefined) {
        return false
    }
    else {
        const isMatch = await bcrypt.compare(req.body.password, result.password)
        if (isMatch)
            return result
        else
            return false
    }
}
export const findAllUser = async (req: Request, res: Response) => {
    res.status(200).json({
        message: "data get successfully",
        totalUsers: req.users.length,
        data: {
            users: req.users,
        },
    });
}


