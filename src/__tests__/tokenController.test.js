const { generateToken } = require('../controllers/token');

describe('Token Controller', () => {
    it('should generate a token for a valid email', () => {
        const req = {
            body: {
                email: "test@example.com"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        generateToken(req, res);
        
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

        generateToken(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
