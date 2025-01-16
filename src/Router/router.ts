import express from "express"
import { createUser } from "../controllers/userController";
import { findAllUser, read } from "../services/userServices";
import { isAlreadyRegistered, validateResult } from "../Middleware/registreValidate";
import { loginUser } from "../Middleware/authentication";
import { adminAuth, userAuth, isLogin } from "../Middleware/authorization";
import cookiesparse from "cookie-parser"
import { validationRulesLogIn, validationRulesSignUp } from "../Middleware/validationRules";
const router = express.Router();
router.use(express.json())
router.use(read)
router.use(cookiesparse())
router.use("/admin", isLogin)
router.use("/user", isLogin)
router.route("/signup").post(validationRulesSignUp, isAlreadyRegistered, validateResult, createUser)
router.route("/login").post(validationRulesLogIn, validateResult, loginUser)
router.route("/user/profile").get(userAuth)
router.route("/admin/users").get(adminAuth, findAllUser)

export default router