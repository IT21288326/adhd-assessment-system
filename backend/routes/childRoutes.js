import express from 'express';
import { signUp, signIn, requestPasswordReset, resetPassword ,getChildProfile} from '../controllers/childController.js';
import { isAuthenticated } from '../controllers/auth.js';
const router = express.Router();

router.post('/signup', signUp); // Sign-up route
router.post('/signin', signIn); // Sign-in route
router.post('/request-password-reset', requestPasswordReset); // Request password reset
router.put('/reset-password/:token', resetPassword); // Reset password
router.get("/profile", isAuthenticated, getChildProfile);

export default router;
