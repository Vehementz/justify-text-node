const { postJustify } = require('../controllers/justify');
const toobusy = require('toobusy-js');
const { justifyText } = require('../utils/justifyText');

jest.mock('toobusy-js');
jest.mock('../utils/justifyText');

describe('Justify Controller', () => {
    beforeEach(() => {
        toobusy.mockReturnValue(false); // Mocking toobusy to always return false
        justifyText.mockReturnValue("Test justified text"); // Mocking justifyText to always return a justified text
    });

    it('should justify the text', () => {
        const req = {
            body: {
                text: "Test justification"
            },
            email: "test@example.com"
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            setHeader: jest.fn()
        };

        postJustify(req, res);
        
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining("Test justified text"));
        expect(res.status).not.toHaveBeenCalledWith(400);
    });
});
