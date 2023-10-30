"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockedBody = require('express-validator').body;
// console.log(mockedBody('email')); // Should show the mocked object with isEmail and withMessage functions
// Mocking the express-validator module
jest.mock('express-validator', () => {
    const mockValidator = {
        isEmail: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis()
    };
    return {
        validationResult: jest.fn().mockReturnValue({ isEmpty: () => true }),
        body: jest.fn().mockReturnValue(mockValidator)
    };
});
const token_1 = require("../controllers/token");
describe('Token Controller', () => {
    it('should generate a token for a valid email', () => {
        const req = {
            body: {
                email: "foo@bar.com"
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        (0, token_1.generateToken)(req, res);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalledWith(400);
    });
    it('should return error for missing email', () => {
        const req = {
            body: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        (0, token_1.generateToken)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
