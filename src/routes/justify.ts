import { Router } from 'express';
import { postJustify } from '../controllers/justify';
import { authorizeUser } from '../controllers/justify';

const router = Router();

// Middleware to authenticate and authorize user for all routes in this router
router.use(authorizeUser);
router.post('/', postJustify);


// router.get('/', justifyController.getJustify);

export default router;
