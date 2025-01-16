import { NextFunction, Request, Response } from "express";
import { isAlreadyRegistered, validateResult } from "../Middleware/registreValidate";
import validator from "express-validator";


const next = jest.fn() as NextFunction

let req: Request

let res: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
} as any




describe("isAlreadyregistered ", () => {
    const mockuser = {
        id: 1,
        email: "test@gmail.com",
        password: "hashpassword"
    }

    req = {
        body: {
            email: "test@gmail.com",
            password: "testpass123",
        },
        users: []

    } as any



    it("should called next", async () => {
        const mockFind = jest.spyOn(Array.prototype, "find").mockReturnValue(undefined)
        await isAlreadyRegistered(req, res, next)
        expect(res.status).not.toHaveBeenCalledWith(409)
        expect(res.json).not.toHaveBeenCalledWith({ message: "The email is already registered" })
        expect(next).toHaveBeenCalled()
        mockFind.mockRestore()
    })

    it("should have status 409 and message: The email is already registered", async () => {
        const mockFind = jest.spyOn(Array.prototype, "find").mockReturnValue(mockuser)
        await isAlreadyRegistered(req, res, next)
        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({ message: "The email is already registered" })
        mockFind.mockRestore()
    })
})

describe("validateResult ", () => {

    let mockval: jest.SpyInstance
    mockval = jest.spyOn(validator, "validationResult")
    afterEach(() => {
        jest.restoreAllMocks();
    })
    it("should call next if no error is found", async () => {
        req.body = {
            body: {
                username: "testusername",
                email: "test@gmail.com",
                password: "123456"
            }
        }

        mockval.mockImplementation(() => ({
            isEmpty: () => false,
            array: () => [{ msg: "Invalid email or password" }],
        }));
        await validateResult(req, res, next)
        expect(next).toHaveBeenCalled()
        mockval.mockRestore()
    })

    it("should have status 400 with error object", async () => {

        const validationResultSpy = jest.spyOn(require("express-validator"), "validationResult").mockImplementation(() => ({
            isEmpty: () => false,
            array: () => [{ msg: "Invalid email or password" }],
        }));
        // expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)

        await validateResult(req, res, next)
        validationResultSpy.mockRestore()

    })
})