// userRoutes.ts

import express from 'express';
import UserController from '../controllers/UserController';

const userController = new UserController()

const router = express.Router();

router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/', userController.store);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
