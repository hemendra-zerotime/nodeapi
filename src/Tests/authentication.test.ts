
import { loginUser } from "../Middleware/authentication"
import *as userServices from "../services/userServices"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
const req: Request = {
    body: {
        email: "test@gmail.com",
        password: "testpass123",
    },
    users: []

} as any
const res: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis()
} as any
jest.mock("../services/userServices")
const mockuser = {
    id: 1,
    username: "testusername",
    email: "test@gmail.com",
    password: "hashpassword",
    role: "user"
}
const mockadmin = {
    id: 2,
    username: "testadmin",
    email: "test@gmail.com",
    password: "hashpassword",
    role: "admin"
}
let mockFindUser: jest.SpyInstance
let mockSign: jest.Mock
describe("login user", () => {
    beforeEach(() => {
        mockFindUser = jest.spyOn(userServices, "findUser")
        mockSign = jest.fn()
        jwt.sign = mockSign
    })
    afterEach(() => {
        mockFindUser.mockRestore();
    })

    it("should have status 404 and message email or password is invalid!", async () => {
        mockFindUser.mockResolvedValueOnce(false)
        await loginUser(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.cookie).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ message: "email or password is invalid!" })
    })

    it("should have status 200 and message with username for normal user", async () => {
        mockFindUser.mockResolvedValueOnce(mockuser)
        const token = "valid_token"
        mockSign.mockReturnValue(token)
        await loginUser(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.cookie).toHaveBeenCalledWith("authtoken", token, {
            maxAge: 10000,
            httpOnly: true,
            secure: true,
            path: "/"
        })
        expect(res.json).toHaveBeenCalledWith({ message: "welcome back testusername" })
    })

    it("should have status 200 and message with username for admin", async () => {
        mockFindUser.mockResolvedValueOnce(mockadmin)
        const token = "valid_token"
        mockSign.mockReturnValue(token)
        await loginUser(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.cookie).toHaveBeenCalledWith("authtoken", token, {
            maxAge: 10000,
            httpOnly: true,
            secure: true,
            path: "/"
        })
        expect(res.json).toHaveBeenCalledWith({ message: "welcome back testadmin(admin)" })
    })
})