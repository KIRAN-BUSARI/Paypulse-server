import express from 'express'
import { getBalance, transfer } from '../controllers/account.controller.js'
import { authMiddleware } from '../middleware/user.middleware.js'

const router = express.Router()

router.get('/getBalance', authMiddleware, getBalance)
router.post('/transfer', authMiddleware, transfer)

export default router;