import { Router } from 'express';
import { validateEmail, generateToken } from '../controllers/token';

const router = Router();

router.post('/', validateEmail, generateToken);

export default router;
