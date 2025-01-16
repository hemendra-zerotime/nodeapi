import { body } from "express-validator"
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