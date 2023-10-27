import { Request, Response, NextFunction } from 'express';

// Types for mock implementations
type MockFn = jest.MockedFunction<any>;

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

import { generateToken } from '../controllers/token';

describe('Token Controller', () => {
    it('should generate a token for a valid email', () => {
        const req = {
            body: {
                email: "test@example.com"
            }
        } as any;
        

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;
        
        generateToken(req, res);
        
        expect(res.json).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalledWith(400);
    });

    it('should return error for missing email', () => {
        const req = {
            body: {}
        } as any;
        

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;
        

        generateToken(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
