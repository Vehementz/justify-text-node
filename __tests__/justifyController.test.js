const { postJustify } = require('../controllers/justify');

describe('Justify Controller', () => {
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
        
        expect(res.send).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalledWith(400);
    });
});
