import jwt from "jsonwebtoken";
import { findUser } from "../services/userServices";
import { Request, Response } from "express-serve-static-core";

const secretKey = process.env.SECRET_KEY;
export const loginUser = async (req: Request, res: Response) => {
  const user = await findUser(req);
  if (user) {
    const token = await jwt.sign({ username: `${user.username}`, role: `${user.role}`, Date: `${Date.now()}` }, `${secretKey}`, { expiresIn: 3000 });
    res
      .cookie("authtoken", token, {
        maxAge: 10000,
        httpOnly: true,
        secure: true,
        path: "/"
      })
      .status(200)
      .json({
        message: `welcome back ${user.role == "admin" ? `${user.username}(admin)` : `${user.username}`}`,
      });
  } else if (user == false) {
    res.status(404).json({
      message: "email or password is invalid!",
    });
  }
};
