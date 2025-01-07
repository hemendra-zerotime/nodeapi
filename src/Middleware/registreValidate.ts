import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
export const validationRulesSignUp = [
    body("username")
        .isLength({ min: 5 })
        .withMessage("username must be of 5 or greater than 5"),
    body("email")
        .isEmail()
        .withMessage("please enter valid email"),
    body("password")
        .isLength({ min: 8, max: 14 })
        .withMessage("password must be of 8 or less than 14")
];
export const validationRulesLogIn = [
    body("email")
        .isEmail()
        .withMessage("please enter valid email"),
    body("password")
        .isLength({ min: 1 })
        .withMessage("please enter password")
];

export const validateResult = (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        res.status(400).json({ error: err.array() });
    }
    else {
        next()
    }
};

export const isAlreadyRegistered = (req: Request, res: Response, next: NextFunction) => {
    const result = req.users.find((user) => user.email === req.body.email)
    if (result === undefined) {
        next()
    }
    else {
        res.json({ message: "The email is already registered" })
    }
}