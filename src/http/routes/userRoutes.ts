// userRoutes.ts

import express from 'express';
import authenticateToken from '../../middlewares/authMiddleware';
import UserController from '../controllers/UserController';

const userController = new UserController()

const router = express.Router();

router.get('/', userController.index);
router.get('/:id', authenticateToken, userController.show);
router.post('/', userController.store);
router.put('/:id', authenticateToken, userController.update);
router.delete('/:id', authenticateToken, userController.delete);

export default router;
