// userRoutes.ts

import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/', UserController.index);
router.get('/:id', UserController.show);
router.post('/', UserController.store);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
