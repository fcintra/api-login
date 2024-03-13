// routes/index.ts

import express from 'express';
import loginRoutes from './loginRoutes';
import userRoutes from './userRoutes';

// Importe outros arquivos de rotas, se houver

const router = express.Router();

// Use as rotas definidas em cada arquivo de rota
router.use('/users', userRoutes);
router.use('/login', loginRoutes);


export default router;
