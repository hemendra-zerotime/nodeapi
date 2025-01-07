import express from "express"
import { createUser } from "../controllers/userController";
import { read } from "../services/userServices";
import { isAlreadyRegistered, validateResult, validationRulesLogIn, validationRulesSignUp } from "../Middleware/registreValidate";
import { loginUser } from "../Middleware/authentication";
import { adminData, authData, isLogin } from "../Middleware/authorization";
import cookiesparse from "cookie-parser"
const router = express.Router();
router.use(express.json())
router.use(read)
router.use(cookiesparse())
router.route("/signup").post(validationRulesSignUp, isAlreadyRegistered, validateResult, createUser)
router.route("/login").post(validationRulesLogIn, validateResult, loginUser)
router.route("/private").get(isLogin, authData)
router.route("/admin").get(isLogin, adminData)

export default router