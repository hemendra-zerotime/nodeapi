import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";


export const validateResult = (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req)
    if (err.isEmpty() == false) {
        res.status(400).json({ error: err.array() });
    }
    else if (err.isEmpty() == true) {
        next()
    }
};

export const isAlreadyRegistered = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    const { users } = req
    const result = users.find((user) => user.email === email)
    if (result === undefined) {
        next()
    }
    else {
        res.status(409).json({ message: "The email is already registered" })
    }
}