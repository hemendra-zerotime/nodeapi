import { Request, Response } from "express";
import { newUserCreate } from "../services/userServices";
import nodemailer, { Transporter, SendMailOptions } from "nodemailer"
import User from "../Model/userModel";
import dotenv from "dotenv"
dotenv.config()
import path from "path"
import fs from "fs"
const file = path.join(__dirname, "../../Users.json")
const sender = process.env.EMAIL;
const pass = process.env.PASS;
const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.email",
    port: 587,
    secure: false,
    auth: {
        user: `${sender}`,
        pass: `${pass}`,
    },
});

export const createUser = async (req: Request, res: Response) => {
    const newUser: User = await newUserCreate(req);
    if (newUser) {
        const mailOptions = {
            from: `${sender}`,
            to: `${newUser.email}`,
            subject: "Registration alert",
            html: `<h1>Hello ${newUser.username}</h1>
            <img src="https://www.registration-confirmation.com/thanks-2.png"><p>Thank you for choosing us you have been successfully registered as a ${newUser.role} with us a registration gift has been attched with this mail</p>`,
            attachments: [
                {
                    path: path.join(__dirname, "../../libuv.pdf")
                }
            ]

        };
        const sendEmail = async (transporter: Transporter, mailOptions: SendMailOptions) => {
            try {
                let { users } = req
                res.status(200).json({ message: `${newUser.username} has been registered as a ${newUser.role}` })
                await transporter.sendMail(mailOptions)
                users.push(newUser)
                fs.writeFile(file, JSON.stringify(users), (err) => {
                    if (err) throw err
                })
            } catch (error) {
                console.log(error)
            }
        }
        sendEmail(transporter, mailOptions)

    }
};

