import express from 'express'
import { currentUser, getUserDetails, signin, signup, updateDetails } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/user.middleware.js';

const router = express.Router()

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/updateDetails', authMiddleware, updateDetails);
router.get("/getDetails", getUserDetails);
router.get("/currentUser", authMiddleware, currentUser);


export default router;