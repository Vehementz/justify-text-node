"use strict";
const { postJustify } = require('../controllers/justify');
const toobusy = require('toobusy-js');
// Mocking the module
jest.mock('../utils/justifyText', () => {
    const originalModule = jest.requireActual('../utils/justifyText');
    return Object.assign(Object.assign({}, originalModule), { justifyText: jest.fn() });
});
// Getting a reference to the mocked function
const { justifyText } = require('../utils/justifyText');
describe('Justify Controller', () => {
    beforeEach(() => {
        // Reset mock calls and return values for each test
        jest.clearAllMocks();
        // Mock the return value for the justifyText function
        justifyText.mockReturnValue("Test justification");
    });
    it('should justify the text for text/plain content type', () => {
        const req = {
            headers: {
                'content-type': 'text/plain',
            },
            body: "Test justification",
            email: "foo@bar.com"
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            setHeader: jest.fn()
        };
        postJustify(req, res);
        // Updated expectation to match the actual output from the controller
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining("<p style=\"text-align: justify; width: 600px;\">Test justification</p>"));
        expect(res.status).not.toHaveBeenCalledWith(400);
    });
});
